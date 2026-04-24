import { Server, Socket } from "socket.io";
import Message from "../models/messageModel";
import Room from "../models/roomModel";
import { PopulatedGroupMessage } from "@/app/types";
import {
  syncGroupStatusToSenders,
  syncOwnDirect,
  mapGroupMessages,
  filterFullyProcessed,
} from "./socketUtils";
import mongoose from "mongoose";

export async function onUserConnect(
  userId: string,
  socket: Socket,
  io: Server,
) {
  await syncDirectUndelivered(userId, io);
  await syncOwnDirect(userId, socket, "delivered", "messagesDelivered");
  await syncOwnDirect(userId, socket, "read", "readReceipt");
  await syncGroupUndelivered(userId, io);
  await syncOwnGroupDelivered(userId, socket);
  await syncOwnGroupRead(userId, socket);
  await syncUnreadCounts(userId, socket);
}

async function syncDirectUndelivered(userId: string, io: Server) {
  const undeliveredMessages = await Message.find({
    recipientId: userId,
    status: "sent",
  });

  if (undeliveredMessages.length > 0) {
    await Message.updateMany(
      { _id: { $in: undeliveredMessages.map((m) => m._id) } },
      { status: "delivered", deliveredAt: new Date() },
    );

    const senderIds = [
      ...new Set(undeliveredMessages.map((m) => m.senderId.toString())),
    ];

    const allSockets = await io.fetchSockets();
    for (const senderId of senderIds) {
      const senderSocket = allSockets.find(
        (s) => s.data.user._id.toString() === senderId,
      );
      if (senderSocket) {
        const messages = undeliveredMessages
          .filter((m) => m.senderId.toString() === senderId)
          .map((m) => ({
            messageId: m._id.toString(),
            roomId: m.customRoomId,
            deliveredAt: new Date(),
          }));

        senderSocket.emit("messagesDelivered", { messages });
      }
    }
  }
}

async function syncGroupUndelivered(userId: string, io: Server) {
  const groupRooms = await Room.find({ members: userId, type: "group" });
  const groupRoomIds = groupRooms.map((r) => r._id);

  const undeliveredGroupMessages = await Message.find({
    roomId: { $in: groupRoomIds },
    senderId: { $ne: userId },
    "deliveredTo.userId": { $ne: userId },
  });

  if (undeliveredGroupMessages.length > 0) {
    await Message.updateMany(
      {
        _id: { $in: undeliveredGroupMessages.map((m) => m._id) },
        "deliveredTo.userId": { $ne: userId },
      },
      { $push: { deliveredTo: { userId, at: new Date() } } },
    );

    const updatedMessages = await Message.find({
      _id: { $in: undeliveredGroupMessages.map((m) => m._id) },
    }).populate("roomId", "members");

    const fullyDelivered = filterFullyProcessed(
      updatedMessages as unknown as PopulatedGroupMessage[],
      "delivered",
    );

    if (fullyDelivered.length === 0) return;

    await syncGroupStatusToSenders(
      fullyDelivered,
      io,
      "delivered",
      "groupMessagesDelivered",
    );
  }
}

async function syncOwnGroupDelivered(userId: string, socket: Socket) {
  const ownGroupMessages = await Message.find({
    senderId: userId,
    recipientId: null,
  }).populate("roomId", "members");

  const fullyDeliveredOwn = filterFullyProcessed(
    ownGroupMessages as unknown as PopulatedGroupMessage[],
    "delivered",
  );

  if (fullyDeliveredOwn.length === 0) return;

  const messages = mapGroupMessages(fullyDeliveredOwn, "delivered");

  socket.emit("groupMessagesDelivered", { messages });
}

async function syncOwnGroupRead(userId: string, socket: Socket) {
  const ownGroupMessages = await Message.find({
    senderId: userId,
    recipientId: null,
  }).populate("roomId", "members");

  const fullyReadOwn = (
    ownGroupMessages as unknown as PopulatedGroupMessage[]
  ).filter((m) => {
    const otherMemberCount = m.roomId.members.length - 1;
    return m.readBy.length === otherMemberCount;
  });

  if (fullyReadOwn.length === 0) return;

  const messages = mapGroupMessages(fullyReadOwn, "read");

  socket.emit("readReceiptGroup", { messages });
}

async function syncUnreadCounts(userId: string, socket: Socket) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const unreadDirect = await Message.aggregate([
    {
      $match: {
        recipientId: userObjectId,
        status: { $ne: "read" },
      },
    },
    { $group: { _id: "$customRoomId", count: { $sum: 1 } } },
  ]);

  const groupRooms = await Room.find({ members: userId, type: "group" });
  const groupRoomIds = groupRooms.map((r) => r._id);

  const unreadGroup = await Message.aggregate([
    {
      $match: {
        roomId: { $in: groupRoomIds },
        senderId: { $ne: userObjectId },
        "readBy.userId": { $ne: userObjectId },
      },
    },
    { $group: { _id: "$customRoomId", count: { $sum: 1 } } },
  ]);

  const unreadCounts: Record<string, number> = {};
  [...unreadDirect, ...unreadGroup].forEach(({ _id, count }) => {
    unreadCounts[_id] = (unreadCounts[_id] ?? 0) + count;
  });

  socket.emit("unreadCounts", { unreadCounts });
}
