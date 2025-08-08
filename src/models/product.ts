import { Schema } from "mongoose";

export const productSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    image: { type: String, default: "" },
    imageList: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    existingPrice: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: false,
      min: 0,
    },
    stock: {
      type: Number,
      required: false,
      min: 0,
    },
    storeId:{ type: Schema.Types.ObjectId},
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "product" }
);
