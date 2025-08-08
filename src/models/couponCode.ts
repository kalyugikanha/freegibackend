import { Schema } from "mongoose";

export const couponCodeSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    code: { type: String, default: "" },
    type:{ type: String},
    minPrice: { type: Number, default: 0 },
    maxPrice: { type: Number, default: 0 },
    endDate: { type: Date },
    limit: { type: Number, default:0},
    discount: { type: Number, default: 0 },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    storeId:{ type: Schema.Types.ObjectId},
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "couponCode" }
);
