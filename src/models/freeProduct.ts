import { Schema } from "mongoose";

export const freeProductSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    image: { type: String, default: "" },
    
    price: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      min: 0,
    },
    storeId:{ type: Schema.Types.ObjectId},
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "freeProduct" }
);
