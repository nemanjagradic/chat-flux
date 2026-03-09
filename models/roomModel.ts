import mongoose, { Model } from "mongoose";

const roomSchema = new mongoose.Schema({
  type: { type: String, enum: ["direct", "group"], required: true },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],

  // group only fields
  name: String,
  icon: String, // emoji like "🎨"
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  lastMessageAt: Date,

  createdAt: { type: Date, default: Date.now },
});

export type RoomType = mongoose.InferSchemaType<typeof roomSchema>;

const Room: Model<RoomType> =
  mongoose.models.Room || mongoose.model<RoomType>("Room", roomSchema);

export default Room;
