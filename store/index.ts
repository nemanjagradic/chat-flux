import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./uiSlice";
import roomsSlice from "./roomSlice";
import messagesSlice from "./messagesSlice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    rooms: roomsSlice.reducer,
    messages: messagesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
