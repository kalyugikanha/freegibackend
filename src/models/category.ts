import { Schema } from "mongoose";

export const categorySchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    image: { type: String, default: null },
    icon: { type: String, default: null },
    color: { type: String, default: null },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId:{ type: Schema.Types.ObjectId}
  },
  { collection: "category" }
);
