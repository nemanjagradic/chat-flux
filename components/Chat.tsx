"use client";

import { AuthUser, SearchedUser } from "@/app/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { socket } from "../lib/socket";
import { useDispatch, useSelector } from "react-redux";
import { roomsActions } from "../store/roomSlice";
import { messagesActions } from "../store/messagesSlice";
import { RootState } from "../store";
import Message from "./Message";
import { TMessage } from "@/app/types";
import MessageInfoModal from "./MessageInfoModal";
import { toast } from "sonner";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLastSeen(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(date).toLocaleDateString("en-GB");
}

const emptyMessages: TMessage[] = [];

export default function Chat({
  currentUser,
  recipientUser,
  roomId,
  initialMessages,
}: {
  currentUser: AuthUser;
  recipientUser: SearchedUser;
  roomId: string;
  initialMessages: TMessage[];
}) {
  const onlineUsers = useSelector(
    (state: RootState) => state.onlineUsers.onlineUsers,
  );
  const lastSeenRedux = useSelector(
    (state: RootState) => state.onlineUsers.lastSeen[recipientUser._id],
  );
  const lastSeen = lastSeenRedux ?? recipientUser.lastSeen;
  const isOnline = onlineUsers.includes(recipientUser._id);
  const [message, setMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<TMessage | null>(null);

  const dispatch = useDispatch();
  const messages = useSelector(
    (state: RootState) =>
      state.messages.messagesByRoom[roomId] ?? emptyMessages,
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("sendMessage", {
      roomId,
      message,
      senderId: currentUser._id,
      recipientId: recipientUser._id,
    });
    setMessage("");
  };

  useEffect(() => {
    dispatch(
      messagesActions.setMessages({ roomId, messages: initialMessages }),
    );
  }, [dispatch, initialMessages, roomId]);

  useEffect(() => {
    socket.emit("joinRoom", { roomId });

    socket.on("roomCreated", (room) => {
      dispatch(roomsActions.addRoom(room));
    });

    socket.on("newMessage", ({ message }) => {
      dispatch(
        messagesActions.addMessage({ message, roomId: message.customRoomId }),
      );
    });

    socket.emit("messagesRead", { roomId });

    socket.on(
      "readReceipt",
      ({
        messages,
      }: {
        messages: { messageId: string; roomId: string; readAt: Date }[];
      }) => {
        messages.forEach(({ messageId, roomId, readAt }) => {
          dispatch(
            messagesActions.updateMessageStatus({
              roomId,
              messageId,
              status: "read",
              readAt,
            }),
          );
        });
      },
    );

    socket.on("messageError", ({ error }) => {
      toast.error(error);
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("roomCreated");
      socket.off("newMessage");
      socket.off("messagesRead");
      socket.off("readReceipt");
      socket.off("messageError");
    };
  }, [dispatch, roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col">
      {selectedMessage && (
        <MessageInfoModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
      <div className="bg-panel2 border-accent/10 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="bg-surface relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            {recipientUser.photo ? (
              <Image
                src={recipientUser.photo}
                alt={recipientUser.name}
                fill
                sizes="40px"
                className="rounded-full object-cover"
              />
            ) : (
              <span className="font-display text-muted text-xs font-bold">
                {getInitials(recipientUser.name)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display text-text truncate text-sm font-semibold">
              {recipientUser.name}
            </p>
            {isOnline ? (
              <p className="text-online text-xs">● Online</p>
            ) : lastSeen ? (
              <p className="text-muted text-xs">
                Last seen {formatLastSeen(lastSeen)}
              </p>
            ) : (
              <p className="text-muted truncate text-xs">
                @{recipientUser.username}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-panel flex flex-1 flex-col gap-2 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted text-xs">No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map((msg: TMessage) => (
          <Message
            key={msg._id}
            text={msg.content}
            time={formatTime(msg.createdAt)}
            status={msg.status}
            onInfoClick={() => setSelectedMessage(msg)}
            deliveredAt={msg.deliveredAt}
            readAt={msg.readAt}
            isOwn={msg.senderId === currentUser._id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="bg-panel2 border-accent/10 flex items-center gap-3 border-t px-5 py-3"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="font-body placeholder:text-muted text-text flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          className="bg-accent hover:bg-accent/80 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors"
        >
          <IoSend className="text-sm text-white" />
        </button>
      </form>
    </div>
  );
}
