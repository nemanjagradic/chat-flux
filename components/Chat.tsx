"use client";

import { AuthUser, SearchedUser } from "@/app/types";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { toggleMessageStar } from "../actions/messagesActions";
import { useChatScrollAndMessages } from "../hooks/useChatScrollAndMessages";
import {
  formatLastSeen,
  formatMessageTime,
  getDateLabel,
  getInitials,
} from "../lib/formatters";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const { messages, bottomRef } = useChatScrollAndMessages({
    roomId,
    initialMessages,
  });

  const handleStarredMessage = async (
    messageId: string,
    isStarred: boolean,
  ) => {
    const result = await toggleMessageStar({ messageId, isStarred });
    if (!result || "error" in result) {
      toast.error("error" in result ? result.error : "Something went wrong");
      return;
    }
    dispatch(
      messagesActions.updateMessageStar({
        roomId,
        messageId,
        isStarred: !isStarred,
      }),
    );
    toast(result.message, {
      icon: "⭐",
      style: {
        background: "#141e35",
        color: "#ffd200",
      },
    });
  };

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

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {selectedMessage && (
        <MessageInfoModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
      <div className="bg-panel2 border-accent/10 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/conversations")}
            className="text-muted hover:text-text transition-colors md:hidden"
          >
            <IoArrowBack className="text-xl" />
          </button>
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
      <div className="bg-panel flex flex-1 flex-col gap-2 overflow-y-auto p-2.5 sm:p-5">
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted text-xs">No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map((msg: TMessage, index: number) => {
          const currentDate = new Date(msg.createdAt).toDateString();
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toDateString()
              : null;
          const showDateSeparator = currentDate !== prevDate;
          return (
            <div key={msg._id}>
              {showDateSeparator && (
                <div className="flex items-center gap-3 py-2">
                  <div className="border-accent/10 flex-1 border-t" />
                  <span className="text-muted text-xs">
                    {getDateLabel(msg.createdAt)}
                  </span>
                  <div className="border-accent/10 flex-1 border-t" />
                </div>
              )}
              <Message
                key={msg._id}
                id={msg._id}
                text={msg.content}
                time={formatMessageTime(msg.createdAt)}
                status={msg.status}
                onInfoClick={() => setSelectedMessage(msg)}
                deliveredAt={msg.deliveredAt}
                readAt={msg.readAt}
                isOwn={msg.senderId === currentUser._id}
                isStarred={msg.isStarred}
                onStarClick={() => handleStarredMessage(msg._id, msg.isStarred)}
              />
            </div>
          );
        })}
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
