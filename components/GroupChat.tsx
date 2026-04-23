"use client";

import { AuthUser } from "@/app/types";
import { useEffect, useState } from "react";
import { IoArrowBack, IoSend } from "react-icons/io5";
import { socket } from "../lib/socket";
import { useDispatch, useSelector } from "react-redux";
import { messagesActions } from "../store/messagesSlice";
import { RootState } from "../store";
import Message from "./Message";
import MessageInfoModal from "./MessageInfoModal";
import { TMessage, TRoom, RoomMember, UserStatus } from "@/app/types";
import { toast } from "sonner";
import { toggleMessageStar } from "../actions/messagesActions";
import { useChatScrollAndMessages } from "../hooks/useChatScrollAndMessages";
import { formatMessageTime, getDateLabel } from "../lib/formatters";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const { messages, bottomRef } = useChatScrollAndMessages({
    roomId,
    initialMessages,
  });

  const handleStarredMessage = async (
    messageId: string,
    isStarred: boolean,
  ) => {
    const result = await toggleMessageStar({
      messageId,
      isStarred,
      userId: currentUser._id,
    });
    if (!result || "error" in result) {
      toast.error("error" in result ? result.error : "Something went wrong");
      return;
    }
    dispatch(
      messagesActions.updateMessageStar({
        roomId,
        messageId,
        userId: currentUser._id,
        isStarred,
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
    socket.emit("sendGroupMessage", {
      roomId,
      message,
      senderId: currentUser._id,
    });
    setMessage("");
  };

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
          <button
            onClick={() => router.push("/conversations")}
            className="text-muted hover:text-text transition-colors md:hidden"
          >
            <IoArrowBack className="text-xl" />
          </button>
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

        {messages.map((msg: TMessage, index: number) => {
          const isStarred =
            msg.starredBy?.some((s) => s.userId === currentUser._id) ?? false;
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
              <div className="flex flex-col">
                {msg.senderId !== currentUser._id && (
                  <span className="text-accent mb-1 ml-1 text-[10px] font-semibold">
                    {getSenderName(msg.senderId)}
                  </span>
                )}
                <Message
                  key={msg._id}
                  id={msg._id}
                  text={msg.content}
                  time={formatMessageTime(msg.createdAt)}
                  isOwn={msg.senderId === currentUser._id}
                  onInfoClick={() => setSelectedMessage(msg)}
                  isGroup={true}
                  deliveredTo={msg.deliveredTo ?? []}
                  readBy={msg.readBy ?? []}
                  totalMembers={room.members.length}
                  members={room.members}
                  isStarred={isStarred}
                  onStarClick={() => handleStarredMessage(msg._id, isStarred)}
                />
              </div>
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
