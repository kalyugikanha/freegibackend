import { Schema } from "mongoose";

export const walletSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        isWallet: {
            type: Boolean,
            default: true
        },
        orderId: { type: String, default: "" },
        paymentId: { type: String, default: "" },
        transactionId: { type: String, default: "" }, // Transaction ID from payment gateway
        paymentDate: { type: Date, default: new Date().toISOString() }, // When the payment was made
        signature:  { type: String, default: "" },
        createdAt: { type: Date, default: new Date().toISOString() },
        updatedAt: { type: Date, default: new Date().toISOString() },
        storeId:{ type: Schema.Types.ObjectId},
    },
    { collection: "wallet" }
);