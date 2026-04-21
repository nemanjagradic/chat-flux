"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import Session from "../models/sessionModel";
import connectDB from "./mongodb";
import { AuthUser } from "@/app/types";
import User, { UserType } from "../models/userModel";
import Room from "../models/roomModel";
import { catchAsyncAction } from "./catchAsync";
import { AppError } from "./appError";
import Message from "../models/messageModel";

export async function createSession(
  userId: string,
  userAgent?: string,
  ip?: string,
  location?: string,
) {
  await connectDB();

  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId,
    token: sessionToken,
    expiresAt: expiresAt,
    userAgent,
    ip,
    location,
  });

  (await cookies()).set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const sessionToken = (await cookies()).get("session")?.value;
  if (!sessionToken) return null;

  await connectDB();

  const session = await Session.findOne({
    token: sessionToken,
    expiresAt: { $gt: new Date() },
  }).populate<{ userId: UserType }>("userId");

  if (!session?.userId) return null;

  const user = session.userId;

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username,
    photo: user.photo,
    messageSounds: user.messageSounds,
    notificationSound: user.notificationSound,
    desktopNotifications: user.desktopNotifications,
    groupAlerts: user.groupAlerts,
    doNotDisturb: user.doNotDisturb,
    isGuest: user.isGuest,
  };
}

export const getUserSessions = catchAsyncAction(async (userId: string) => {
  await connectDB();
  const sessionToken = (await cookies()).get("session")?.value;

  const sessions = await Session.find({ userId }).sort({ lastUsedAt: -1 });

  return {
    sessions: JSON.parse(
      JSON.stringify(
        sessions.map((s) => ({
          _id: s._id.toString(),
          userAgent: s.userAgent,
          ip: s.ip,
          location: s.location ?? "Unknown",
          createdAt: s.createdAt,
          lastUsedAt: s.lastUsedAt,
          isCurrent: s.token === sessionToken,
        })),
      ),
    ),
  };
});

export async function getLocationFromIp(ip?: string): Promise<string> {
  if (!ip || ip === "::1" || ip === "127.0.0.1") return "Localhost";
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    if (data.city && data.country_code) {
      return `${data.city}, ${data.country_code}`;
    }
    return "Unknown";
  } catch {
    return "Unknown";
  }
}

export async function logout() {
  try {
    await connectDB();
    const sessionToken = (await cookies()).get("session")?.value;
    if (sessionToken) await Session.deleteOne({ token: sessionToken });
    (await cookies()).delete("session");
    return { message: "Logged out successfully" };
  } catch {
    return { error: "Failed to logout" };
  }
}

export async function deleteAccount() {
  try {
    await connectDB();
    const sessionToken = (await cookies()).get("session")?.value;
    if (!sessionToken) return { error: "Unauthorized" };

    const session = await Session.findOne({ token: sessionToken });
    if (!session) return { error: "Session not found" };

    const userId = session.userId;

    await Room.updateMany(
      { type: "group", members: userId },
      { $pull: { members: userId } },
    );

    await Session.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
    (await cookies()).delete("session");

    return { message: "Account deleted successfully" };
  } catch {
    return { error: "Failed to delete account" };
  }
}

export async function deleteGuestData() {
  try {
    await connectDB();

    const sessionToken = (await cookies()).get("session")?.value;
    if (!sessionToken) return { error: "Unauthorized" };

    const session = await Session.findOne({ token: sessionToken });
    if (!session) return { error: "Session not found" };

    const userId = session.userId;

    const guestRooms = await Room.find({ members: userId });
    const roomIds = guestRooms.map((r) => r.roomId).filter(Boolean) as string[];

    await Message.deleteMany({ customRoomId: { $in: roomIds } });
    await Room.deleteMany({ members: userId });
    await Session.deleteOne({ userId });
    await User.findByIdAndDelete(userId);
    (await cookies()).delete("session");

    return { message: "Guest session ended" };
  } catch {
    return { error: "Failed to end guest session" };
  }
}

export const revokeSession = catchAsyncAction(async (sessionId: string) => {
  await connectDB();
  const sessionToken = (await cookies()).get("session")?.value;
  if (!sessionToken) throw new AppError("Unauthorized", 401);

  const currentSession = await Session.findOne({ token: sessionToken });
  if (!currentSession) throw new AppError("Unauthorized", 401);

  await Session.findOneAndDelete({
    _id: sessionId,
    userId: currentSession.userId,
  });

  return { message: "Session revoked" };
});

export const revokeAllSessions = catchAsyncAction(async () => {
  await connectDB();
  const sessionToken = (await cookies()).get("session")?.value;
  if (!sessionToken) throw new AppError("Unauthorized", 401);

  const currentSession = await Session.findOne({ token: sessionToken });
  if (!currentSession) throw new AppError("Unauthorized", 401);

  await Session.deleteMany({
    userId: currentSession.userId,
    _id: { $ne: currentSession._id },
  });

  return { message: "All other sessions revoked" };
});
