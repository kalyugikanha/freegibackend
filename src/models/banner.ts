import { Schema } from "mongoose";

export const bannerSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    image: { type: String, default: null },
    description: { type: String, default: "" },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "banner" }
);
