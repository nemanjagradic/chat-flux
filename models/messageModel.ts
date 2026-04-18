import mongoose, { Model } from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  customRoomId: String,
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: [true, "Message cannot be empty."],
    trim: true,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  deliveredAt: Date,
  readAt: Date,
  deliveredTo: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      at: { type: Date, default: Date.now },
    },
  ],
  readBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      at: { type: Date, default: Date.now },
    },
  ],
  isStarred: { type: Boolean, default: false },
  starredAt: Date,
  starredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  editedAt: Date,
});

export type MessageType = mongoose.InferSchemaType<typeof messageSchema>;

const Message: Model<MessageType> =
  mongoose.models.Message ||
  mongoose.model<MessageType>("Message", messageSchema);

export default Message;
