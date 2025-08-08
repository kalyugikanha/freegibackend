import { Schema } from "mongoose";

// const productSchema = new Schema(
//   {
//     productId: { type: Schema.Types.ObjectId, ref: "Products" },
//     quantity: { type: Number, default: 0 },
//     price: { type: Number, default: 0 },
//   },
//   { _id: false }
// );

export const cartSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "userId required."],
    },
    // products: { type: [{ productSchema }], default: {} },
    products: [{
      productId: {  type: Schema.Types.ObjectId },
      quantity: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
      optionId: { type: Schema.Types.ObjectId, required: true, ref: 'options'},
      flog: { type: String, default:"product"}
    }],
    dealofthedayId: [
      {
        dealId: { type: Schema.Types.ObjectId, ref: "dealoftheday" },
        flog: { type: String, default: "dealOfDay" },
        quantity: { type: Number, default: 0 },
      },
    ],

    amount: { type: Number, default: 0 },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId:{ type: Schema.Types.ObjectId},
  },
  { collection: "cart" }
);
