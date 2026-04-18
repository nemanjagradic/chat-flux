"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { roomsActions } from "../store/roomSlice";

export default function ConversationsMenu() {
  const roomType = useSelector((state: RootState) => state.rooms.type);

  const dispatch = useDispatch();

  const handleRoomType = (type: string) => {
    dispatch(roomsActions.setType({ type }));
  };

  const types = ["All", "Direct", "Groups"];

  return (
    <ul className="font-body flex gap-4 px-4 py-2">
      {types.map((type) => {
        const isActive = roomType === type;
        return (
          <li
            key={type}
            onClick={() => handleRoomType(type)}
            className={`border-accent/30 cursor-pointer rounded-full border px-3 py-1 font-medium ${
              isActive
                ? "bg-accent text-text"
                : "text-muted hover:bg-panel2 hover:text-text"
            }`}
          >
            {type}
          </li>
        );
      })}
    </ul>
  );
}
