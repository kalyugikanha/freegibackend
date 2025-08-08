import { Schema } from "mongoose";

export const addressSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    tag: { type: String, required: [true, "tag required."] },
    addressType: { type: String },
    floor: { type: String },
    address: { type: String, default: null },
    landMark: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    pincode: { type: String, default: "" },
    lat: { type: String, default: "" },
    long: { type: String, default: "" },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    default: { type: Boolean, default: false }
  },
  { collection: "address" }
);
