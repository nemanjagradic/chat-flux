"use server";

import { AppError } from "../lib/appError";
import { catchAsyncAction, catchAsyncFormAction } from "../lib/catchAsync";
import { Email } from "../lib/email";
import connectDB from "../lib/mongodb";
import {
  createSession,
  getCurrentUser,
  getLocationFromIp,
} from "../lib/session";
import User, { UserType } from "../models/userModel";
import crypto from "crypto";
import { AuthUser, SearchedUser, SigninData, SignupData } from "@/app/types";
import { revalidatePath } from "next/cache";
import { uploadImage } from "../lib/cloudinary";
import Session from "../models/sessionModel";
import { cookies, headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const signupUser = catchAsyncAction<
  SignupData,
  { message: string; user: AuthUser }
>(async (data) => {
  await connectDB();
  const { name, username, email, password, passwordConfirm } = data;

  const newUser = await User.create({
    name: name,
    username: username,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
  });

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") ?? undefined;
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ?? undefined;
  const location = await getLocationFromIp(ip);

  await createSession(newUser._id.toString(), userAgent, ip, location);

  return {
    message: "User created successfully",
    user: {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      photo: newUser.photo,
    },
  };
});

export const signinUser = catchAsyncAction<
  SigninData,
  { message: string; user: AuthUser }
>(async (data) => {
  await connectDB();
  const { email, password } = data;

  if (!email || !password)
    throw new AppError("You must provide email and password.", 400);

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    throw new AppError("Incorrect email or password.", 401);

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") ?? undefined;
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ?? undefined;

  const location = await getLocationFromIp(ip);

  await createSession(user._id.toString(), userAgent, ip, location);

  return {
    message: "User signin successfully",
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      photo: user.photo,
    },
  };
});

export const createGuestUser = catchAsyncAction<
  null,
  { message: string; user: AuthUser }
>(async () => {
  await connectDB();

  const guestId = uuidv4().slice(0, 8);

  const newGuestUser = await User.create({
    name: `Guest user`,
    username: `guest_${guestId}`,
    email: `guest_${guestId}@guest.com`,
    password: "guest123",
    passwordConfirm: "guest123",
    isGuest: true,
  });

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") ?? undefined;
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ?? undefined;
  const location = await getLocationFromIp(ip);

  await createSession(newGuestUser._id.toString(), userAgent, ip, location);

  return {
    message: "Signed in as guest",
    user: {
      _id: newGuestUser._id.toString(),
      name: newGuestUser.name,
      email: newGuestUser.email,
      username: newGuestUser.username,
    },
  };
});

export const forgotPassword = catchAsyncAction(async (email: string) => {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) throw new AppError("No user found with that email.", 404);

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.NEXT_PUBLIC_APP_URL}/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError(
      "There was an error sending the email. Please try later!",
      500,
    );
  }

  return { message: "Reset link sent to your email" };
});

export const resetPassword = catchAsyncAction(
  async ({
    token,
    newPassword,
    passwordConfirm,
  }: {
    token: string;
    newPassword: string;
    passwordConfirm: string;
  }) => {
    await connectDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: new Date() },
    });

    if (!user) throw new AppError("Token is invalid or expired.", 400);

    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    return { message: "Password reset successfully!" };
  },
);

export const searchUsers = catchAsyncAction(
  async ({
    query,
    currentUserId,
  }: {
    query: string;
    currentUserId: string;
  }) => {
    await connectDB();
    if (!query) return { users: [] as SearchedUser[] };

    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    })
      .select("name username photo")
      .limit(20);

    return {
      users: users.map((u) => ({
        _id: u._id.toString(),
        name: u.name,
        username: u.username,
        photo: u.photo,
      })) satisfies SearchedUser[],
    };
  },
);

export const getUserById = catchAsyncAction(async (id: string) => {
  await connectDB();
  const user = await User.findById(id).select("name username photo lastSeen");
  if (!user) throw new AppError("User not found", 404);

  return {
    _id: user._id.toString(),
    name: user.name,
    username: user.username,
    photo: user.photo,
    lastSeen: user.lastSeen?.toISOString() ?? null,
  };
});

export const updateProfile = catchAsyncFormAction(
  async (_, formData: FormData) => {
    const session = await getCurrentUser();
    if (!session) throw new AppError("Unauthorized", 401);

    const name = formData.get("name")?.toString();
    const username = formData.get("username")?.toString();
    const bio = formData.get("bio")?.toString();
    const photo = formData.get("photo") as File | null;

    await connectDB();

    const updates: Record<string, string> = {};
    if (name) updates.name = name;
    if (username) updates.username = username;
    if (bio) updates.bio = bio;
    if (photo && photo.size > 0) await uploadImage(updates, photo);

    await User.findByIdAndUpdate(session._id, updates, { runValidators: true });
    revalidatePath("/");

    return { message: "Profile updated successfully" };
  },
);

export const updateAccount = catchAsyncFormAction(
  async (_, formData: FormData) => {
    const sessionToken = (await cookies()).get("session")?.value;
    if (!sessionToken) throw new AppError("Unauthorized", 401);

    await connectDB();

    const session = await Session.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
    }).populate<{
      userId: UserType & { password: string; passwordConfirm: string };
    }>("userId", "+password");
    if (!session?.userId) throw new AppError("Unauthorized", 401);
    if (session?.userId.isGuest)
      return { message: "Not available for guest accounts" };

    const user = session.userId;

    const email = formData.get("email")?.toString();
    const currentPassword = formData.get("currentPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmNewPassword = formData.get("confirmNewPassword")?.toString();

    if (email && email !== user.email) user.email = email;

    const wantsToChangePassword =
      currentPassword || newPassword || confirmNewPassword;

    if (wantsToChangePassword) {
      if (!currentPassword)
        throw new AppError("Please provide your current password.", 400);
      if (!newPassword)
        throw new AppError("Please provide a new password.", 400);
      if (!confirmNewPassword)
        throw new AppError("Please confirm your new password.", 400);
      if (newPassword !== confirmNewPassword)
        throw new AppError("New password and confirmation do not match.", 400);
      if (!(await user.correctPassword(currentPassword, user.password)))
        throw new AppError("Your current password is incorrect.", 400);

      user.password = newPassword;
      user.passwordConfirm = confirmNewPassword;
    }

    await user.save({ validateModifiedOnly: true });
    revalidatePath("/");

    return { message: "Account updated successfully" };
  },
);

export const updateNotificationSettings = catchAsyncFormAction(
  async (_, formData: FormData) => {
    const session = await getCurrentUser();
    if (!session) throw new AppError("Unauthorized", 401);

    await connectDB();

    const updates: Record<string, boolean> = {};

    if (formData.has("messageSounds"))
      updates.messageSounds = formData.get("messageSounds") === "true";
    if (formData.has("notificationSound"))
      updates.notificationSound = formData.get("notificationSound") === "true";
    if (formData.has("desktopNotifications"))
      updates.desktopNotifications =
        formData.get("desktopNotifications") === "true";
    if (formData.has("groupAlerts"))
      updates.groupAlerts = formData.get("groupAlerts") === "true";
    if (formData.has("doNotDisturb"))
      updates.doNotDisturb = formData.get("doNotDisturb") === "true";

    await User.findByIdAndUpdate(session._id, updates);
    revalidatePath("/");

    return { message: "Settings saved" };
  },
);
