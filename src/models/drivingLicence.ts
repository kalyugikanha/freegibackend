import { Schema } from "mongoose";

export const drivingLicenceSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    image: { type: String, default: null },
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    status: {
      type: String,
      enum: ["pending", "verified", "cancelled"],
      default: "pending",
    },
    aadhar: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId:{ type: Schema.Types.ObjectId},
  },
  { collection: "drivingLicence" }
);
