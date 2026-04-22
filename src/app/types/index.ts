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
  isGuest?: boolean;
};

export type SigninData = {
  email: string;
  password: string;
  deviceInfo?: TDeviceInfo;
};

export type SignupData = {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  deviceInfo?: TDeviceInfo;
};

export type TDeviceInfo = {
  browserName?: string;
  deviceType?: string;
  deviceModel?: string;
  osName?: string;
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
  isStarred: boolean;
  status?: string;
  deliveredAt?: Date;
  readAt?: Date;
  deliveredTo?: UserStatus[];
  readBy?: UserStatus[];
  createdAt: string;
};

export type TStarredMessage = {
  _id: string;
  content: string;
  customRoomId: string;
  senderId: {
    _id: string;
    name: string;
    photo?: string;
  };
  roomId?: {
    _id: string;
    name?: string;
    roomId: string;
  };
  recipientId?: string;
  isStarred: boolean;
  createdAt: string;
  status?: string;
};

export type TSessionItem = {
  _id: string;
  browserName?: string;
  deviceType?: string;
  deviceModel?: string;
  osName?: string;
  ip?: string;
  location?: string;
  createdAt: string;
  lastUsedAt: string;
  isCurrent: boolean;
};
