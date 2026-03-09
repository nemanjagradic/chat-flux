import { cookies } from "next/headers";
import crypto from "crypto";
import Session from "../models/sessionModel";
import connectDB from "./mongodb";
import { AuthUser } from "@/app/types";
import { UserType } from "../models/userModel";

export async function createSession(userId: string) {
  await connectDB();

  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId,
    token: sessionToken,
    expiresAt: expiresAt,
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
  };
}

export async function logout() {
  await connectDB();
  const sessionToken = (await cookies()).get("session")?.value;
  if (sessionToken) await Session.deleteOne({ token: sessionToken });
  (await cookies()).delete("session");
}
