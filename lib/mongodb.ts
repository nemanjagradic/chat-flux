// lib/mongodb.ts
import mongoose from "mongoose";
import "../models/userModel";
import "../models/sessionModel";

declare global {
  var _mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const DB = process.env.DATABASE!.replace(
  "<password>",
  process.env.DATABASE_PASSWORD!,
);

if (!DB) {
  throw new Error("Please define the DB environment variable in .env.local");
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

const cached = global._mongooseCache;

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(DB as string);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
