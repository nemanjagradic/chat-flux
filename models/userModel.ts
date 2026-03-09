import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

export type UserType = Document & {
  email: string;
  name: string;
  username: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  photo?: string;
  bio?: string;
  isOnline: boolean;
  lastSeen?: Date;
  messageSounds: boolean;
  notificationSound: boolean;
  desktopNotifications: boolean;
  groupAlerts: boolean;
  doNotDisturb: boolean;
  isGuest: boolean;
  createdAt: Date;
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  createPasswordResetToken(): string;
};

const userSchema = new mongoose.Schema<UserType>({
  email: {
    type: String,
    required: [true, "User must have a email."],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email."],
    trim: true,
  },
  name: {
    type: String,
    required: [true, "User must have a name."],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "User must have a username."],
    minlength: [6, "Username must be at least 6 characters"],
    maxlength: [16, "Username can have maximum of 16 characters."],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: [8, "Password must be at least 8 characters long."],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: {
      validator: function (this: UserType, el: string) {
        return el === this.password;
      },
      message: "Passwords are not the same.",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  photo: String,
  bio: String,
  isOnline: { type: Boolean, default: false },
  lastSeen: Date,
  messageSounds: { type: Boolean, default: true },
  notificationSound: { type: Boolean, default: true },
  desktopNotifications: { type: Boolean, default: true },
  groupAlerts: { type: Boolean, default: false },
  doNotDisturb: { type: Boolean, default: false },
  isGuest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcryptjs.hash(this.password as string, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

const User: Model<UserType> =
  mongoose.models.User || mongoose.model<UserType>("User", userSchema);

export default User;
