import { Schema } from "mongoose";

export const wishSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        productId: [{
            type: Schema.Types.ObjectId
        }],
        createdAt: { type: Date, default: new Date().toISOString() },
        updatedAt: { type: Date, default: new Date().toISOString() },
        storeId:{ type: Schema.Types.ObjectId},
    },
    { collection: "wish" }
);