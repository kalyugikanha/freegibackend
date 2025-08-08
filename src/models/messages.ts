import mongoose, { Schema } from "mongoose";

export const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true }, // Common ID for customer-driver chat (e.g., order ID)
    senderId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    message: { type: String, required: true },
    flag: { type: String, default: "" },
    timestamp: { type: Date, default: new Date().toISOString() },
    storeId:{ type: Schema.Types.ObjectId},
  },
  { collection: "message" }
);
