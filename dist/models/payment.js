"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.paymentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Orders", required: true },
    paymentId: { type: String, default: "" },
    amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ["credit_card", "paypal", "bank_transfer", "razorpay", "cash", "wallet"],
        required: true,
    },
    transactionId: { type: String },
    status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
    },
    paymentGateway: { type: String, default: "" },
    paymentDate: { type: Date, default: new Date().toISOString() },
    refundDate: { type: Date, default: null },
    receiptUrl: { type: String, default: "" },
    signature: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, { collection: "payments" });
//# sourceMappingURL=payment.js.map