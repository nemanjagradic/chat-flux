"use server";

import { catchAsyncAction } from "../lib/catchAsync";
import connectDB from "../lib/mongodb";
import Message from "../models/messageModel";
import Room from "../models/roomModel";

export const getMessagesByRoom = catchAsyncAction(async (roomId: string) => {
  await connectDB();
  const messages = await Message.find({ customRoomId: roomId }).sort({
    createdAt: 1,
  });
  return { messages: JSON.parse(JSON.stringify(messages)) };
});

export const toggleMessageStar = catchAsyncAction(
  async ({
    messageId,
    isStarred,
  }: {
    messageId: string;
    isStarred: boolean;
  }) => {
    await connectDB();

    if (!isStarred) {
      await Message.findByIdAndUpdate(messageId, {
        isStarred: true,
        starredAt: new Date(),
      });
    } else {
      await Message.findByIdAndUpdate(messageId, {
        isStarred: false,
        starredAt: null,
      });
    }

    return {
      message: `Message is marked as ${!isStarred ? "starred" : "unstarred"}`,
    };
  },
);

export const getStarredMessages = catchAsyncAction(async (userId: string) => {
  await connectDB();

  const userRooms = await Room.find({ members: userId });
  const roomIds = userRooms.map((r) => r._id);

  const messages = await Message.find({
    isStarred: true,
    $or: [
      { senderId: userId },
      { recipientId: userId },
      { roomId: { $in: roomIds } },
    ],
  })
    .populate("senderId", "name photo")
    .populate("roomId", "name roomId")
    .sort({ starredAt: -1 });

  return { messages: JSON.parse(JSON.stringify(messages)) };
});
