import { Schema } from "mongoose";

export const featureditemSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        productId: { type: Schema.Types.ObjectId },
        storeId:{ type: Schema.Types.ObjectId},
        createdAt: { type: Date, default: new Date().toISOString() },
        updatedAt: { type: Date, default: new Date().toISOString() },
    },
    { collection: "featureditem" }
);
