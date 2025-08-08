import { Schema } from "mongoose";

export const areaSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, default: null },
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    pincode: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "area" }
);
