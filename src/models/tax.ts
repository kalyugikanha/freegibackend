import { Schema } from "mongoose";

export const taxSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    percentage: { type: Number, default: 0 },
    description: { type: String, default: "" },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId:{ type: Schema.Types.ObjectId},
  },
  { collection: "tax" }
);
