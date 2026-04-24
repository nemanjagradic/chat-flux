import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TRoom, LastMessage } from "@/app/types";

type RoomsState = {
  rooms: TRoom[];
  type: string;
  searchName: string;
  unreadCounts: Record<string, number>;
};

const initialState: RoomsState = {
  rooms: [],
  type: "All",
  searchName: "",
  unreadCounts: { roomId: 0 },
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
    setType(state, action: PayloadAction<{ type: string }>) {
      state.type = action.payload.type;
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

        state.rooms = [...state.rooms].sort((a, b) => {
          const dateA = a.lastMessageAt
            ? new Date(a.lastMessageAt).getTime()
            : 0;
          const dateB = b.lastMessageAt
            ? new Date(b.lastMessageAt).getTime()
            : 0;
          return dateB - dateA;
        });
      }
    },
    setSearchName: (state, action) => {
      state.searchName = action.payload;
    },
    setUnreadCounts(state, action: PayloadAction<Record<string, number>>) {
      state.unreadCounts = action.payload;
    },
    incrementUnread(state, action: PayloadAction<{ roomId: string }>) {
      const { roomId } = action.payload;
      state.unreadCounts[roomId] = (state.unreadCounts[roomId] ?? 0) + 1;
    },
    resetUnread(state, action: PayloadAction<{ roomId: string }>) {
      const { roomId } = action.payload;
      state.unreadCounts[roomId] = 0;
    },
  },
});

export default roomsSlice;
export const roomsActions = roomsSlice.actions;
