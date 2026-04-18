"use server";

import { RoomMember } from "@/app/types";
import { catchAsyncAction } from "../lib/catchAsync";
import connectDB from "../lib/mongodb";
import Room from "../models/roomModel";

export const getUserRooms = catchAsyncAction(async (userId: string) => {
  await connectDB();
  const rooms = await Room.find({ members: userId })
    .populate("members", "name username photo")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });

  return { rooms: JSON.parse(JSON.stringify(rooms)) };
});

export const getRoomByRoomId = catchAsyncAction(async (roomId: string) => {
  await connectDB();

  const room = await Room.findOne({ roomId })
    .populate("members", "name username photo")
    .populate("lastMessage");

  return { room: JSON.parse(JSON.stringify(room)) };
});

export const searchRooms = catchAsyncAction(
  async ({
    name,
    userId,
    onlyGroups,
  }: {
    name: string;
    userId: string;
    onlyGroups?: boolean;
  }) => {
    await connectDB();

    const allRooms = await Room.find({ members: userId })
      .populate("members", "name username photo")
      .populate("lastMessage", "content");

    const searchedRooms = allRooms.filter((room) => {
      if (onlyGroups) {
        return room.name?.toLowerCase().includes(name.toLowerCase());
      }
      if (room.type === "direct") {
        return (room.members as unknown as RoomMember[]).some(
          (member) =>
            member._id.toString() !== userId &&
            member.name.toLowerCase().includes(name.toLowerCase()),
        );
      }
      if (room.type === "group") {
        return room.name?.toLowerCase().includes(name.toLowerCase());
      }
      return false;
    });

    return { rooms: JSON.parse(JSON.stringify(searchedRooms)) };
  },
);
