import mongoose, { Model } from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  device: String,
  browser: String,
  location: String,
  deviceType: {
    type: String,
    enum: ["computer", "phone", "tablet"],
    default: "computer",
  },
  createdAt: { type: Date, default: Date.now },
});

export type SessionType = mongoose.InferSchemaType<typeof sessionSchema>;

const Session: Model<SessionType> =
  mongoose.models.Session ||
  mongoose.model<SessionType>("Session", sessionSchema);

export default Session;
