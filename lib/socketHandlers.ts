import { Server, Socket } from "socket.io";
import Room from "../models/roomModel";
import Message from "../models/messageModel";
import connectDB from "./mongodb";
import mongoose from "mongoose";
import { PopulatedGroupMessage } from "@/app/types";
import {
  filterFullyProcessed,
  syncGroupStatusToSenders,
  updateRoomLastMessage,
} from "./socketUtils";
import User from "../models/userModel";
import { catchSocketHandler, catchSocketHandlerSilent } from "./catchAsync";

export function handleJoinRoom(socket: Socket) {
  return catchSocketHandlerSilent(async ({ roomId }: { roomId: string }) => {
    await socket.join(roomId);
  });
}

export function handleSendMessage(
  socket: Socket,
  io: Server,
  onlineUsers: Set<string>,
) {
  return catchSocketHandler(
    async ({
      roomId,
      message,
      senderId,
      recipientId,
    }: {
      roomId: string;
      message: string;
      senderId: string;
      recipientId: string;
    }) => {
      await connectDB();

      let room = await Room.findOne({ roomId });
      if (!room) {
        await Room.create({
          roomId,
          type: "direct",
          members: [senderId, recipientId],
        });
        room = await Room.findOne({ roomId }).populate(
          "members",
          "name username photo",
        );
        io.to(roomId).emit("roomCreated", room);
      }

      if (!room) throw new Error("Room creation failed");

      const recipientInRoom = (await io.in(roomId).fetchSockets()).some(
        (s) => s.data.user._id.toString() === recipientId,
      );

      const status = recipientInRoom
        ? "read"
        : onlineUsers.has(recipientId)
          ? "delivered"
          : "sent";

      const newMessage = await Message.create({
        roomId: room._id,
        customRoomId: roomId,
        senderId,
        recipientId,
        content: message,
        status,
        deliveredAt:
          status === "delivered" || status === "read" ? new Date() : undefined,
        readAt: status === "read" ? new Date() : undefined,
      });

      await updateRoomLastMessage(
        io,
        roomId,
        room._id,
        newMessage,
        message,
        senderId,
      );
      io.to(roomId).emit("newMessage", { message: newMessage.toObject() });
    },
    socket,
    "messageError",
  );
}

export function handleMessagesRead(io: Server, userId: string) {
  return catchSocketHandlerSilent(async ({ roomId }: { roomId: string }) => {
    await connectDB();

    const unreadMessages = await Message.find({
      customRoomId: roomId,
      recipientId: userId,
      status: "delivered",
    });

    if (unreadMessages.length === 0) return;

    await Message.updateMany(
      { _id: { $in: unreadMessages.map((m) => m._id) } },
      { status: "read", readAt: new Date() },
    );

    const senderId = unreadMessages[0].senderId.toString();
    const allSockets = await io.fetchSockets();
    const senderSocket = allSockets.find(
      (s) => s.data.user._id.toString() === senderId,
    );

    if (senderSocket) {
      const messages = unreadMessages.map((m) => ({
        messageId: m._id.toString(),
        roomId: m.customRoomId,
        readAt: new Date(),
      }));
      senderSocket.emit("readReceipt", { messages });
    }
  });
}

export function handleCreateGroup(socket: Socket, io: Server, userId: string) {
  return catchSocketHandler(
    async ({
      name,
      icon,
      members,
    }: {
      name: string;
      icon: string;
      members: string[];
    }) => {
      const errors: string[] = [];
      if (!name.trim()) errors.push("Group must have a name");
      if (!members || members.length < 3)
        errors.push("Group must have at least 2 members");

      if (errors.length > 0) {
        socket.emit("groupError", { errors });
        return;
      }

      await connectDB();

      const group = await Room.create({
        roomId: new mongoose.Types.ObjectId().toString(),
        type: "group",
        name,
        icon,
        members,
        createdBy: userId,
      });

      const populatedGroup = await Room.findById(group._id).populate(
        "members",
        "name username photo",
      );

      const allSockets = await io.fetchSockets();
      for (const memberId of members) {
        const memberSocket = allSockets.find(
          (s) => s.data.user._id.toString() === memberId.toString(),
        );
        if (memberSocket) {
          memberSocket.emit("groupCreated", populatedGroup);
        }
      }
    },
    socket,
    "groupError",
  );
}

export function handleSendGroupMessage(
  socket: Socket,
  io: Server,
  onlineUsers: Set<string>,
) {
  return catchSocketHandler(
    async ({
      roomId,
      message,
      senderId,
    }: {
      roomId: string;
      message: string;
      senderId: string;
    }) => {
      await connectDB();

      const room = await Room.findOne({ roomId });
      if (!room) throw new Error("Room not found");

      const otherMembers = room.members.filter(
        (m) => m.toString() !== senderId,
      );
      const deliveredTo = otherMembers.filter((m) =>
        onlineUsers.has(m.toString()),
      );
      const sockets = await io.in(roomId).fetchSockets();
      const membersSet = new Set(otherMembers.map((m) => m.toString()));
      const readBy = sockets
        .map((s) => s.data.user._id.toString())
        .filter((userId) => membersSet.has(userId));

      const newMessage = await Message.create({
        roomId: room._id,
        customRoomId: roomId,
        senderId,
        content: message,
        deliveredTo: deliveredTo.map((m) => ({ userId: m, at: new Date() })),
        readBy: readBy.map((m) => ({ userId: m, at: new Date() })),
      });

      await updateRoomLastMessage(
        io,
        roomId,
        room._id,
        newMessage,
        message,
        senderId,
      );
      io.to(roomId).emit("newMessage", { message: newMessage.toObject() });
    },
    socket,
    "messageError",
  );
}

export function handleMessagesReadGroup(io: Server, userId: string) {
  return catchSocketHandlerSilent(async ({ roomId }: { roomId: string }) => {
    await connectDB();

    const unreadGroupMessages = await Message.find({
      customRoomId: roomId,
      senderId: { $ne: userId },
      "readBy.userId": { $ne: userId },
    });

    if (unreadGroupMessages.length === 0) return;

    await Message.updateMany(
      {
        _id: { $in: unreadGroupMessages.map((m) => m._id) },
        "readBy.userId": { $ne: userId },
      },
      { $push: { readBy: { userId, at: new Date() } } },
    );

    const updatedMessages = await Message.find({
      _id: { $in: unreadGroupMessages.map((m) => m._id) },
    }).populate("roomId", "members");

    const fullyRead = filterFullyProcessed(
      updatedMessages as unknown as PopulatedGroupMessage[],
      "read",
    );

    if (fullyRead.length === 0) return;

    await syncGroupStatusToSenders(fullyRead, io, "read", "readReceiptGroup");
  });
}

export function handleLeaveRoom(socket: Socket) {
  return catchSocketHandlerSilent(async ({ roomId }: { roomId: string }) => {
    socket.leave(roomId);
  });
}

export function handleDisconnect(
  io: Server,
  onlineUsers: Set<string>,
  userId: string,
) {
  return catchSocketHandlerSilent(async () => {
    onlineUsers.delete(userId);
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
    io.emit("userOffline", { userId, lastSeen: new Date() });
  });
}
