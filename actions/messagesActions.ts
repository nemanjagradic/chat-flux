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
