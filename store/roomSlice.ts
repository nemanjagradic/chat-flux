import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TRoom, LastMessage } from "@/app/types";

type RoomsState = {
  rooms: TRoom[];
};

const initialState: RoomsState = {
  rooms: [],
};

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRooms(state, action: PayloadAction<TRoom[]>) {
      state.rooms = action.payload;
    },
    addRoom(state, action: PayloadAction<TRoom>) {
      const exists = state.rooms.some(
        (r) => r.roomId === action.payload.roomId,
      );
      if (!exists) state.rooms.push(action.payload);
    },
    updateRoomLastMessage(
      state,
      action: PayloadAction<{
        roomId: string;
        lastMessage: LastMessage;
        lastMessageAt: string;
      }>,
    ) {
      const room = state.rooms.find((r) => r.roomId === action.payload.roomId);
      if (room) {
        room.lastMessage = action.payload.lastMessage;
        room.lastMessageAt = action.payload.lastMessageAt;
      }
    },
  },
});

export default roomsSlice;
export const roomsActions = roomsSlice.actions;
