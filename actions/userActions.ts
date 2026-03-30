"use server";

import { AppError } from "../lib/appError";
import { catchAsyncAction } from "../lib/catchAsync";
import { Email } from "../lib/email";
import connectDB from "../lib/mongodb";
import { createSession } from "../lib/session";
import User from "../models/userModel";
import crypto from "crypto";
import { AuthUser, SearchedUser, SigninData, SignupData } from "@/app/types";

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

  await createSession(newUser._id.toString());

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

  await createSession(user._id.toString());

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
  const user = await User.findById(id).select("name username photo");
  if (!user) throw new AppError("User not found", 404);
  return {
    _id: user._id.toString(),
    name: user.name,
    username: user.username,
    photo: user.photo,
  };
});
