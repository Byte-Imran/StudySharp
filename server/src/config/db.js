import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.info("Connected to MongoDB.");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
