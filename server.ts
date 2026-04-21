import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import connectDB from "./lib/mongodb";
import Session from "./models/sessionModel";
import {
  handleCreateGroup,
  handleDisconnect,
  handleJoinRoom,
  handleLeaveRoom,
  handleMessagesRead,
  handleMessagesReadGroup,
  handleSendGroupMessage,
  handleSendMessage,
} from "./lib/socketHandlers";
import { onUserConnect } from "./lib/connectionHandler";

async function startServer() {
  const app = next({ dev: process.env.ENV !== "production" });
  const handler = app.getRequestHandler();

  await app.prepare();

  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
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

    socket.on("getOnlineUsers", () => {
      socket.emit("onlineUsers", { userIds: [...onlineUsers] });
    });
    io.emit("userOnline", { userId });

    socket.on("joinRoom", handleJoinRoom(socket));

    socket.on("sendMessage", handleSendMessage(socket, io, onlineUsers));
    socket.on("messagesRead", handleMessagesRead(io, userId));
    socket.on("createGroup", handleCreateGroup(socket, io, userId));
    socket.on(
      "sendGroupMessage",
      handleSendGroupMessage(socket, io, onlineUsers),
    );
    socket.on("messagesReadGroup", handleMessagesReadGroup(io, userId));

    socket.on("leaveRoom", handleLeaveRoom(socket));
    socket.on("disconnect", handleDisconnect(io, onlineUsers, userId));

    await connectDB();
    await onUserConnect(userId, socket, io);
  });

  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

startServer();
