import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStatus, TMessage } from "@/app/types";

type MessagesState = {
  messagesByRoom: Record<string, TMessage[]>;
};

const initialState: MessagesState = {
  messagesByRoom: {},
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages(
      state,
      action: PayloadAction<{ roomId: string; messages: TMessage[] }>,
    ) {
      state.messagesByRoom[action.payload.roomId] = action.payload.messages;
    },
    addMessage(
      state,
      action: PayloadAction<{ roomId: string; message: TMessage }>,
    ) {
      const { roomId, message } = action.payload;
      if (!state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId] = [];
      }
      state.messagesByRoom[roomId].push(message);
    },
    updateMessageStatus(
      state,
      action: PayloadAction<{
        roomId: string;
        messageId: string;
        status: string;
        deliveredAt?: Date;
        readAt?: Date;
      }>,
    ) {
      const messages = state.messagesByRoom[action.payload.roomId];
      if (messages) {
        const message = messages.find(
          (m) => m._id === action.payload.messageId,
        );
        if (message) {
          message.status = action.payload.status;
          if (action.payload.deliveredAt !== undefined) {
            message.deliveredAt = action.payload.deliveredAt;
          }

          if (action.payload.readAt !== undefined) {
            message.readAt = action.payload.readAt;
          }
        }
      }
    },
    updateGroupMessageDeliveredTo(
      state,
      action: PayloadAction<{
        roomId: string;
        messageId: string;
        deliveredTo: UserStatus[];
      }>,
    ) {
      const messages = state.messagesByRoom[action.payload.roomId];
      if (messages) {
        const message = messages.find(
          (m) => m._id === action.payload.messageId,
        );
        if (message) message.deliveredTo = action.payload.deliveredTo;
      }
    },
    updateGroupMessageReadBy(
      state,
      action: PayloadAction<{
        roomId: string;
        messageId: string;
        readBy: UserStatus[];
      }>,
    ) {
      const messages = state.messagesByRoom[action.payload.roomId];
      if (messages) {
        const message = messages.find(
          (m) => m._id === action.payload.messageId,
        );
        if (message) message.readBy = action.payload.readBy;
      }
    },
    addReadByMember(
      state,
      action: PayloadAction<{
        roomId: string;
        messageId: string;
        userId: string;
        at: string;
      }>,
    ) {
      const messages = state.messagesByRoom[action.payload.roomId];
      if (messages) {
        const message = messages.find(
          (m) => m._id === action.payload.messageId,
        );
        if (message && message.readBy) {
          const alreadyRead = message.readBy.some(
            (r) => r.userId === action.payload.userId,
          );
          if (!alreadyRead) {
            message.readBy.push({
              userId: action.payload.userId,
              at: action.payload.at,
            });
          }
        }
      }
    },
  },
});

export default messagesSlice;
export const messagesActions = messagesSlice.actions;
