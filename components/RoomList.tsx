"use client";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../store";
import { roomsActions } from "../store/roomSlice";
import { useEffect } from "react";
import { TRoom } from "@/app/types";
import Image from "next/image";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function timeAgo(date?: string) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function RoomList({
  currentUserId,
  initialRooms,
}: {
  currentUserId: string;
  initialRooms: TRoom[];
}) {
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const onlineUsers = useSelector(
    (state: RootState) => state.onlineUsers.onlineUsers,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(roomsActions.setRooms(initialRooms));
  }, [initialRooms, dispatch]);

  const { roomId: activeRoomId } = useParams();
  const router = useRouter();

  if (rooms.length === 0) {
    return (
      <p className="text-muted px-4 py-6 text-center text-xs">
        No conversations yet
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {rooms.map((room: TRoom) => {
        const isActive = room.roomId === activeRoomId;
        const otherMember =
          room.type === "direct"
            ? room.members.find((m) => m._id !== currentUserId)
            : null;

        const displayName =
          room.type === "group" ? room.name : otherMember?.name;
        const displayIcon = room.type === "group" ? room.icon : null;
        if (room.type === "direct" && !otherMember) return null;

        return (
          <div
            key={room._id}
            onClick={() => router.push(`/conversations/${room.roomId}`)}
            className={`relative flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${
              isActive ? "bg-accent/10" : "hover:bg-accent/5"
            }`}
          >
            {isActive && (
              <div className="bg-accent absolute top-2 bottom-2 left-0 w-0.5 rounded-r" />
            )}

            <div className="bg-accent/20 relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              {displayIcon ? (
                <span className="text-base">{displayIcon}</span>
              ) : otherMember?.photo ? (
                <Image
                  src={otherMember.photo}
                  alt={otherMember.name}
                  fill
                  sizes="40px"
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="font-display text-accent text-xs font-bold">
                  {getInitials(displayName ?? "?")}
                </span>
              )}

              {room.type === "direct" &&
                otherMember &&
                onlineUsers.includes(otherMember._id) && (
                  <span className="bg-online border-surface absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2" />
                )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-text truncate text-xs font-semibold">
                {displayName}
              </p>
              <p className="text-muted truncate text-xs">
                {room.lastMessage
                  ? room.lastMessage.content
                  : "No messages yet"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-muted text-[9px]">
                {timeAgo(room.lastMessageAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
