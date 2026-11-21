import mongoose from "mongoose";
import { env } from "./env.js";

const cached = (globalThis._mongoose ??= { conn: null, promise: null });

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  cached.promise ??= mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 8000,
  });

  try {
    cached.conn = await cached.promise;
    console.log("Connected to MongoDB.");
  } catch (error) {
    cached.promise = null; // agli request dobara try karegi
    throw error; // process.exit mat karo
  }
  return cached.conn;
};

export default connectDB;
