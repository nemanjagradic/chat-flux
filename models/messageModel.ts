import mongoose, { Model } from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  }, // for direct messages
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // for groups
  isStarred: { type: Boolean, default: false },
  starredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  editedAt: Date,
});

export type MessageType = mongoose.InferSchemaType<typeof messageSchema>;

const Message: Model<MessageType> =
  mongoose.models.Message ||
  mongoose.model<MessageType>("Message", messageSchema);

export default Message;
