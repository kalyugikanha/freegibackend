import { Schema } from "mongoose";

export const dealofthedaySchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name:{ type: Schema.Types.String},
        image:{ type: Schema.Types.String},
        price:{ type: Schema.Types.Number},
        description: { type: Schema.Types.String},
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product" },
                optionId: { type: Schema.Types.ObjectId,ref:"option" },
            },
        ],
        storeId:{ type: Schema.Types.ObjectId},
        createdAt: { type: Date, default: new Date().toISOString() },
        updatedAt: { type: Date, default: new Date().toISOString() },
    },
    { collection: "dealoftheday" }
);
