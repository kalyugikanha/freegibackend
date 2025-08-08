import { Schema } from "mongoose";

export const subCategorySchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "Category required."],
      ref: "Category",
    },
    icon: { type: String, default: null },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    storeId:{ type: Schema.Types.ObjectId},
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "subCategory" }
);
