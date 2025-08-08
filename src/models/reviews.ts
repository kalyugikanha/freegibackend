import { Schema } from "mongoose";

export const reviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, default: "" },
    storeId:{ type: Schema.Types.ObjectId},
    createdAt: { type: Date, default: new Date().toISOString() },
    
  },
  { collection: "reviews" }
);
