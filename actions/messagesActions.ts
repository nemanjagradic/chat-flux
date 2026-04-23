"use server";

import { catchAsyncAction } from "../lib/catchAsync";
import connectDB from "../lib/mongodb";
import Message from "../models/messageModel";

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
    userId,
  }: {
    messageId: string;
    isStarred: boolean;
    userId: string;
  }) => {
    await connectDB();

    await Message.findByIdAndUpdate(
      messageId,
      isStarred
        ? { $pull: { starredBy: { userId } } }
        : { $push: { starredBy: { userId, starredAt: new Date() } } },
    );

    return {
      message: `Message ${!isStarred ? "starred" : "unstarred"}`,
    };
  },
);

export const getStarredMessages = catchAsyncAction(async (userId: string) => {
  await connectDB();

  const messages = await Message.find({ "starredBy.userId": userId })
    .populate("senderId", "name photo")
    .populate("roomId", "name roomId")
    .sort({ "starredBy.starredAt": -1 });

  return { messages: JSON.parse(JSON.stringify(messages)) };
});
