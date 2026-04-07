import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import Room from "../models/roomModel";
import Message from "../models/messageModel";
import { PopulatedGroupMessage } from "@/app/types";

export async function updateRoomLastMessage(
  io: Server,
  roomId: string,
  roomObjectId: mongoose.Types.ObjectId,
  newMessage: { _id: mongoose.Types.ObjectId; createdAt: Date },
  content: string,
  senderId: string,
) {
  await Room.findByIdAndUpdate(roomObjectId, {
    lastMessage: newMessage._id,
    lastMessageAt: newMessage.createdAt,
  });

  io.to(roomId).emit("roomUpdated", {
    roomId,
    lastMessage: {
      _id: newMessage._id,
      content,
      senderId,
      createdAt: newMessage.createdAt,
    },
    lastMessageAt: newMessage.createdAt,
  });
}

export async function syncOwnDirect(
  userId: string,
  socket: Socket,
  status: "delivered" | "read",
  eventName: string,
) {
  const ownMessages = await Message.find({
    senderId: userId,
    status,
  });

  if (ownMessages.length > 0) {
    const messages = ownMessages.map((m) => ({
      messageId: m._id.toString(),
      roomId: m.customRoomId,
      ...(status === "delivered" && { deliveredAt: m.deliveredAt }),
      ...(status === "read" && { readAt: m.readAt }),
    }));

    socket.emit(eventName, { messages });
  }
}

export async function syncGroupStatusToSenders(
  messages: PopulatedGroupMessage[],
  io: Server,
  status: "delivered" | "read",
  eventName: string,
) {
  const senderIds = [...new Set(messages.map((m) => m.senderId.toString()))];
  const allSockets = await io.fetchSockets();

  for (const senderId of senderIds) {
    const senderSocket = allSockets.find(
      (s) => s.data.user._id.toString() === senderId,
    );

    if (!senderSocket) continue;

    const senderMessagesRaw = messages.filter(
      (m) => m.senderId.toString() === senderId,
    );

    const senderMessages = mapGroupMessages(senderMessagesRaw, status);

    senderSocket.emit(eventName, { messages: senderMessages });
  }
}

export function filterFullyProcessed(
  messages: PopulatedGroupMessage[],
  status: "delivered" | "read",
) {
  return messages.filter((m) => {
    const otherMemberCount = m.roomId.members.length - 1;

    if (status === "delivered") {
      return m.deliveredTo.length === otherMemberCount;
    }

    return m.readBy.length === otherMemberCount;
  });
}

export function mapGroupMessages(
  messages: PopulatedGroupMessage[],
  status: "delivered" | "read",
) {
  return messages.map((m) => {
    const base = {
      messageId: m._id.toString(),
      roomId: m.customRoomId,
    };

    if (status === "delivered") {
      return {
        ...base,
        deliveredTo: (
          m.deliveredTo as unknown as {
            userId: mongoose.Types.ObjectId;
            at: Date;
          }[]
        ).map((d) => ({
          userId: d.userId.toString(),
          at: d.at,
        })),
      };
    }

    return {
      ...base,
      readBy: (
        m.readBy as unknown as {
          userId: mongoose.Types.ObjectId;
          at: Date;
        }[]
      ).map((r) => ({
        userId: r.userId.toString(),
        at: r.at,
      })),
    };
  });
}
