"use client";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../store";
import { roomsActions } from "../store/roomSlice";
import { useEffect } from "react";
import { TRoom } from "@/app/types";

export default function GroupList({ initialRooms }: { initialRooms: TRoom[] }) {
  const rooms = useSelector((state: RootState) =>
    state.rooms.rooms.filter((r) => r.type === "group"),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(roomsActions.setRooms(initialRooms));
  }, [initialRooms, dispatch]);

  const { roomId: activeRoomId } = useParams();
  const router = useRouter();

  if (rooms.length === 0) {
    return (
      <p className="text-muted px-4 py-6 text-center text-xs">No groups yet</p>
    );
  }

  return (
    <div className="flex flex-col">
      {rooms.map((room: TRoom) => {
        const isActive = room.roomId === activeRoomId;

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

            <div className="bg-accent/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
              <span className="text-base">{room.icon ?? "👥"}</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-display text-text truncate text-xs font-semibold">
                {room.name}
              </p>
              <p className="text-muted truncate text-xs">
                {room.lastMessage
                  ? room.lastMessage.content
                  : "No messages yet"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-muted text-[9px]">
                {room.members.length} members
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
