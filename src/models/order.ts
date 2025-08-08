import { Schema } from "mongoose";

const orderProductSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, default: 0 },
    optionId: { type: Schema.Types.ObjectId, required: true, ref: 'options'},
    flog: { type: String, default:"product"}
  },
  { _id: false }
);

export const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    products: { type: [orderProductSchema], required: true },
    dealofthedays: [
      {
        dealId: { type: Schema.Types.ObjectId, ref: "dealoftheday" },
        flog: { type: String, default: "dealOfDay" },
        quantity: { type: Number, default: 0 },
      },
    ],
    cartOffer: {
    cartOfferId: { type: Schema.Types.ObjectId},
    type: { type: String, enum: ["product", "freeGift"] }, // "product" ya "freeGift"
    productId: { type: Schema.Types.ObjectId, ref: "product" }, 
    optionId: { type: Schema.Types.ObjectId, ref: "option" },
    freeGiftId: { type: Schema.Types.ObjectId, ref: "freeProduct" }
  },
    orderId: { type: String, default: "" },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["", "pending", "confirmed", "shipped", "delivered", "cancelled", "returned", "exchanged"],
      default: "",
    },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    handlingCharge: { type: Number, default: 0 },
    couponCode: {
      type: Schema.Types.ObjectId,
      ref: "CouponCode",
      default: null,
    },
    paymentMethod: { type: String, default: "" },
    deliveryAgent: { type: Schema.Types.ObjectId, ref: "Users", default: null },
    tax: { type: Schema.Types.ObjectId, ref: "Tax", default: null },
    paymentStatus: { type: String, default: "" },
    orderDate: { type: Date, default: null },
    deliveryDate: { type: Date, default: null },
    deliveryInstruction: { type: String, default: "" },
    address: { type: Schema.Types.ObjectId, ref: "Address" },
    notes: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    reason: [{ type: String }],
    description: { type: String },
    image: { type: String },
    storeId:{ type: Schema.Types.ObjectId},
  },
  { collection: "orders" }
);
