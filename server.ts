import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import connectDB from "./lib/mongodb";
import Session from "./models/sessionModel";
import Room from "./models/roomModel";
import Message from "./models/messageModel";
import mongoose from "mongoose";
import { PopulatedGroupMessage } from "@/app/types";

async function startServer() {
  const app = next({ dev: process.env.ENV !== "production" });
  const handler = app.getRequestHandler();

  await app.prepare();

  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie || "";

    const sessionToken = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];

    if (!sessionToken) return next(new Error("Unauthorized"));

    await connectDB();

    const session = await Session.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
    }).populate("userId");

    if (!session?.userId) return next(new Error("Unauthorized"));

    socket.data.user = session.userId;
    next();
  });

  const onlineUsers = new Set<string>();

  io.on("connection", async (socket) => {
    const userId = socket.data.user._id.toString();
    onlineUsers.add(userId);

    socket.on("joinRoom", async ({ roomId }) => {
      await socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ roomId, message, senderId, recipientId }) => {
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

        const recipientInRoom = (await io.in(roomId).fetchSockets()).some(
          (s) => s.data.user._id.toString() === recipientId,
        );

        const status = recipientInRoom
          ? "read"
          : onlineUsers.has(recipientId)
            ? "delivered"
            : "sent";

        const newMessage = await Message.create({
          roomId: room?._id,
          customRoomId: roomId,
          senderId,
          recipientId,
          content: message,
          status,
          deliveredAt:
            status === "delivered" || status === "read"
              ? new Date()
              : undefined,
          readAt: status === "read" ? new Date() : undefined,
        });

        await Room.findByIdAndUpdate(room?._id, {
          lastMessage: newMessage._id,
          lastMessageAt: newMessage.createdAt,
        });

        io.to(roomId).emit("newMessage", { message: newMessage.toObject() });
        io.to(roomId).emit("roomUpdated", {
          roomId,
          lastMessage: {
            _id: newMessage._id,
            content: message,
            senderId,
            createdAt: newMessage.createdAt,
          },
          lastMessageAt: newMessage.createdAt,
        });
      },
    );

    socket.on("messagesRead", async ({ roomId }) => {
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

    socket.on("createGroup", async ({ name, icon, members }) => {
      const errors: string[] = [];
      if (!name.trim()) errors.push("Group must have a name");
      if (!members || members.length < 3)
        errors.push("Group must have at least 2 members");

      if (errors.length > 0) {
        return socket.emit("groupError", { errors });
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
    });

    socket.on("sendGroupMessage", async ({ roomId, message, senderId }) => {
      await connectDB();

      const room = await Room.findOne({ roomId });
      const otherMembers = room?.members.filter(
        (m) => m.toString() !== senderId,
      );

      const deliveredTo = otherMembers?.filter((m) =>
        onlineUsers.has(m.toString()),
      );

      const sockets = await io.in(roomId).fetchSockets();

      const membersSet = new Set(otherMembers?.map((m) => m.toString()));

      const readBy = sockets
        .map((s) => s.data.user._id.toString())
        .filter((userId) => membersSet.has(userId));

      const newMessage = await Message.create({
        roomId: room?._id,
        customRoomId: roomId,
        senderId,
        content: message,
        deliveredTo: deliveredTo?.map((m) => ({
          userId: m,
          at: new Date(),
        })),
        readBy: readBy?.map((m) => ({ userId: m, at: new Date() })),
      });

      await Room.findByIdAndUpdate(room?._id, {
        lastMessage: newMessage._id,
        lastMessageAt: newMessage.createdAt,
      });

      io.to(roomId).emit("newMessage", { message: newMessage.toObject() });
      io.to(roomId).emit("roomUpdated", {
        roomId,
        lastMessage: {
          _id: newMessage._id,
          content: message,
          senderId,
          createdAt: newMessage.createdAt,
        },
        lastMessageAt: newMessage.createdAt,
      });
    });

    socket.on("messagesReadGroup", async ({ roomId }) => {
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
        {
          $push: { readBy: { userId, at: new Date() } },
        },
      );

      const updatedMessages = await Message.find({
        _id: { $in: unreadGroupMessages.map((m) => m._id) },
      }).populate("roomId", "members");

      const fullyRead = (
        updatedMessages as unknown as PopulatedGroupMessage[]
      ).filter((m) => {
        const otherMemberCount = m.roomId.members.length - 1;
        return m.readBy.length === otherMemberCount;
      });

      if (fullyRead.length === 0) return;

      const senderIds = [
        ...new Set(fullyRead.map((m) => m.senderId.toString())),
      ];

      const allSockets = await io.fetchSockets();
      for (const senderId of senderIds) {
        const senderSocket = allSockets.find(
          (s) => s.data.user._id.toString() === senderId,
        );
        if (senderSocket) {
          const messages = fullyRead
            .filter((m) => m.senderId.toString() === senderId)
            .map((m) => ({
              messageId: m._id.toString(),
              roomId: m.customRoomId,
              readBy: (
                m.readBy as unknown as {
                  userId: mongoose.Types.ObjectId;
                  at: Date;
                }[]
              ).map((r) => ({
                userId: r.userId.toString(),
                at: r.at,
              })),
            }));

          senderSocket.emit("readReceiptGroup", { messages });
        }
      }
    });

    socket.on("leaveRoom", ({ roomId }) => {
      socket.leave(roomId);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
    });

    await connectDB();

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

    const ownDeliveredMessages = await Message.find({
      senderId: userId,
      status: "delivered",
    });

    if (ownDeliveredMessages.length > 0) {
      const messages = ownDeliveredMessages.map((m) => ({
        messageId: m._id.toString(),
        roomId: m.customRoomId,
        deliveredAt: m.deliveredAt,
      }));

      socket.emit("messagesDelivered", { messages });
    }

    const ownReadMessages = await Message.find({
      senderId: userId,
      status: "read",
    });

    if (ownReadMessages.length > 0) {
      const messages = ownReadMessages.map((m) => ({
        messageId: m._id.toString(),
        roomId: m.customRoomId,
        readAt: m.readAt,
      }));

      socket.emit("readReceipt", { messages });
    }

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

      const fullyDelivered = (
        updatedMessages as unknown as PopulatedGroupMessage[]
      ).filter((m) => {
        const otherMemberCount = m.roomId.members.length - 1;
        return m.deliveredTo.length === otherMemberCount;
      });

      if (fullyDelivered.length > 0) {
        const senderIds = [
          ...new Set(fullyDelivered.map((m) => m.senderId.toString())),
        ];

        const allSockets = await io.fetchSockets();
        for (const senderId of senderIds) {
          const senderSocket = allSockets.find(
            (s) => s.data.user._id.toString() === senderId,
          );
          if (senderSocket) {
            const messages = fullyDelivered
              .filter((m) => m.senderId.toString() === senderId)
              .map((m) => ({
                messageId: m._id.toString(),
                roomId: m.customRoomId,
                deliveredTo: (
                  m.deliveredTo as unknown as {
                    userId: mongoose.Types.ObjectId;
                    at: Date;
                  }[]
                ).map((d) => ({
                  userId: d.userId.toString(),
                  at: d.at,
                })),
              }));

            senderSocket.emit("groupMessagesDelivered", { messages });
          }
        }
      }
    }

    const ownGroupMessages = await Message.find({
      senderId: userId,
      recipientId: null,
    }).populate("roomId", "members");

    const fullyDeliveredOwn = (
      ownGroupMessages as unknown as PopulatedGroupMessage[]
    ).filter((m) => {
      const otherMemberCount = m.roomId.members.length - 1;
      return m.deliveredTo.length === otherMemberCount;
    });

    if (fullyDeliveredOwn.length > 0) {
      const messages = fullyDeliveredOwn.map((m) => ({
        messageId: m._id.toString(),
        roomId: m.customRoomId,
        deliveredTo: (
          m.deliveredTo as unknown as {
            userId: mongoose.Types.ObjectId;
            at: Date;
          }[]
        ).map((d) => ({
          userId: d.userId.toString(),
          at: d.at,
        })),
      }));
      socket.emit("groupMessagesDelivered", { messages });
    }

    const fullyReadOwn = (
      ownGroupMessages as unknown as PopulatedGroupMessage[]
    ).filter((m) => {
      const otherMemberCount = m.roomId.members.length - 1;
      return m.readBy.length === otherMemberCount;
    });

    if (fullyReadOwn.length > 0) {
      const messages = fullyReadOwn.map((m) => ({
        messageId: m._id.toString(),
        roomId: m.customRoomId,
        readBy: (
          m.readBy as unknown as {
            userId: mongoose.Types.ObjectId;
            at: Date;
          }[]
        ).map((r) => ({
          userId: r.userId.toString(),
          at: r.at,
        })),
      }));
      socket.emit("readReceiptGroup", { messages });
    }
  });

  httpServer.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

startServer();
