import { Schema } from "mongoose";

export const cartOffer = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    freeGiftId: [{ type: Schema.Types.ObjectId, ref: 'freeProduct' }], 
    products:[{ 
      productId:{type: Schema.Types.ObjectId, ref: 'product'},
      optionId:{type: Schema.Types.ObjectId, ref: 'optionId'}
    }],
    minPrice: {
      type: Number,
      min: 0,
    },
    maxPrice: {
      type: Number,
      min: 0,
    },
    isFreeDeliver:{
        type: Number,
        default:0
    },
    storeId:{ type: Schema.Types.ObjectId},
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "cartOffer" }
);