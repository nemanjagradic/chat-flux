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
