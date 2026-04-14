import mongoose from "mongoose";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  username: string;
  photo?: string;
  messageSounds?: boolean;
  notificationSound?: boolean;
  desktopNotifications?: boolean;
  groupAlerts?: boolean;
  doNotDisturb?: boolean;
};

export type SigninData = {
  email: string;
  password: string;
};

export type SignupData = {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type SearchedUser = {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  lastSeen?: string | null;
};

export type RoomMember = {
  _id: string;
  name: string;
  username: string;
  photo?: string;
};

export type TRoom = {
  _id: string;
  roomId: string;
  type: "direct" | "group";
  members: RoomMember[];
  name?: string;
  icon?: string;
  lastMessage?: LastMessage;
  lastMessageAt?: string;
  createdAt: string;
};

export type LastMessage = {
  _id: string;
  content: string;
  senderId: string;
  createdAt: string;
};

export type PopulatedMessage = {
  _id: mongoose.Types.ObjectId;
  customRoomId: string;
  senderId: mongoose.Types.ObjectId;
  status: string;
};

export type PopulatedGroupMessage = {
  _id: mongoose.Types.ObjectId;
  roomId: { _id: mongoose.Types.ObjectId; members: mongoose.Types.ObjectId[] };
  senderId: mongoose.Types.ObjectId;
  deliveredTo: mongoose.Types.ObjectId[];
  readBy: mongoose.Types.ObjectId[];
  customRoomId: string;
};

export type UserStatus = {
  userId: string;
  at: string | Date;
};

export type TMessage = {
  _id: string;
  roomId: string;
  customRoomId: string;
  senderId: string;
  recipientId?: string;
  content: string;
  status?: string;
  deliveredAt?: Date;
  readAt?: Date;
  deliveredTo?: UserStatus[];
  readBy?: UserStatus[];
  createdAt: string;
};
