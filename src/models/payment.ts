import { Schema } from "mongoose";

export const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Orders", required: true },
    paymentId: { type: String, default: "" },
    amount: { type: Number, required: true }, // Define your default currency
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer", "razorpay", "cash", "wallet"],
      required: true,
    },
    transactionId: { type: String}, // Transaction ID from payment gateway
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentGateway: { type: String, default: "" }, // e.g., Stripe, PayPal
    paymentDate: { type: Date, default: new Date().toISOString() }, // When the payment was made
    refundDate: { type: Date, default: null }, // Date of refund, if applicable
    receiptUrl: { type: String, default: "" }, // URL to payment receipt if provided by gateway
    signature:  { type: String, default: "" },
    description: { type: String, default: "" }, // Optional description of the payment
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId:{ type: Schema.Types.ObjectId},
  },
  { collection: "payments" }
);
