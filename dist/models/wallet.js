"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletSchema = void 0;
const mongoose_1 = require("mongoose");
exports.walletSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
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
    transactionId: { type: String, default: "" },
    paymentDate: { type: Date, default: new Date().toISOString() },
    signature: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, { collection: "wallet" });
//# sourceMappingURL=wallet.js.map