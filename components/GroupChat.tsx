"use client";

import { AuthUser } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { socket } from "../lib/socket";
import { useDispatch, useSelector } from "react-redux";
import { messagesActions } from "../store/messagesSlice";
import { RootState } from "../store";
import Message from "./Message";
import MessageInfoModal from "./MessageInfoModal";
import { TMessage, TRoom, RoomMember, UserStatus } from "@/app/types";
import { toast } from "sonner";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const emptyMessages: TMessage[] = [];

export default function GroupChat({
  currentUser,
  room,
  roomId,
  initialMessages,
}: {
  currentUser: AuthUser;
  room: TRoom;
  roomId: string;
  initialMessages: TMessage[];
}) {
  const onlineUsers = useSelector(
    (state: RootState) => state.onlineUsers.onlineUsers,
  );
  const isMembersOnline = () => {
    const onlineMembers = room.members.filter(
      (m) => m._id !== currentUser._id && onlineUsers.includes(m._id),
    );
    if (room.members.length === onlineUsers.length) {
      return "All members online";
    }
    if (onlineMembers.length > 0) {
      return `${onlineMembers.length} online now`;
    }
    return `${room.members.length} members`;
  };

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
    socket.emit("sendGroupMessage", {
      roomId,
      message,
      senderId: currentUser._id,
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

    socket.on("newMessage", ({ message }) => {
      dispatch(
        messagesActions.addMessage({ message, roomId: message.customRoomId }),
      );
    });

    socket.emit("messagesReadGroup", { roomId });

    socket.on(
      "readReceiptGroup",
      ({
        messages,
      }: {
        messages: {
          messageId: string;
          roomId: string;
          readBy: UserStatus[];
        }[];
      }) => {
        messages.forEach(({ messageId, roomId, readBy }) => {
          dispatch(
            messagesActions.updateGroupMessageReadBy({
              roomId,
              messageId,
              readBy,
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
      socket.off("newMessage");
      socket.off("messagesReadGroup");
      socket.off("readReceiptGroup");
      socket.off("messageError");
    };
  }, [dispatch, roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSenderName = (senderId: string) => {
    if (senderId === currentUser._id) return "You";
    const member = room.members.find((m: RoomMember) => m._id === senderId);
    return member?.name ?? "Unknown";
  };

  return (
    <div className="flex flex-1 flex-col">
      {selectedMessage && (
        <MessageInfoModal
          message={selectedMessage}
          members={room.members}
          onClose={() => setSelectedMessage(null)}
        />
      )}
      <div className="bg-panel2 border-accent/10 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="bg-accent/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <span className="text-xl">{room.icon ?? "👥"}</span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-text truncate text-sm font-semibold">
              {room.name}
            </p>
            <p className="text-muted truncate text-xs">{isMembersOnline()}</p>
          </div>
        </div>
        <div className="flex items-center -space-x-2">
          {room.members.slice(0, 4).map((member: RoomMember) => (
            <div
              key={member._id}
              className="bg-accent/20 border-panel2 flex h-7 w-7 items-center justify-center rounded-full border-2"
              title={member.name}
            >
              <span className="font-display text-accent text-[9px] font-bold">
                {member.name[0].toUpperCase()}
              </span>
            </div>
          ))}
          {room.members.length > 4 && (
            <div className="bg-panel border-panel2 flex h-7 w-7 items-center justify-center rounded-full border-2">
              <span className="text-muted text-[9px]">
                +{room.members.length - 4}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="bg-panel flex flex-1 flex-col gap-2 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted text-xs">No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map((msg: TMessage) => (
          <div key={msg._id} className="flex flex-col">
            {msg.senderId !== currentUser._id && (
              <span className="text-accent mb-1 ml-1 text-[10px] font-semibold">
                {getSenderName(msg.senderId)}
              </span>
            )}
            <Message
              key={msg._id}
              text={msg.content}
              time={formatTime(msg.createdAt)}
              isOwn={msg.senderId === currentUser._id}
              onInfoClick={() => setSelectedMessage(msg)}
              isGroup={true}
              deliveredTo={msg.deliveredTo ?? []}
              readBy={msg.readBy ?? []}
              totalMembers={room.members.length}
              members={room.members}
            />
          </div>
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
          placeholder={`Message ${room.name}...`}
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
