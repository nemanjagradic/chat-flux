import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type onlineUsersState = {
  onlineUsers: string[];
  lastSeen: Record<string, string>;
};

const initialOnlineUsersState: onlineUsersState = {
  onlineUsers: [],
  lastSeen: {},
};

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: initialOnlineUsersState,
  reducers: {
    addOnlineUser(state, action: PayloadAction<string>) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser(
      state,
      action: PayloadAction<{ userId: string; lastSeen: string }>,
    ) {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload.userId,
      );
      state.lastSeen[action.payload.userId] = action.payload.lastSeen;
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
  },
});

export default onlineUsersSlice;
export const onlineUsersActions = onlineUsersSlice.actions;
