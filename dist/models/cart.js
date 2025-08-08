"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = void 0;
const mongoose_1 = require("mongoose");
// const productSchema = new Schema(
//   {
//     productId: { type: Schema.Types.ObjectId, ref: "Products" },
//     quantity: { type: Number, default: 0 },
//     price: { type: Number, default: 0 },
//   },
//   { _id: false }
// );
exports.cartSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: [true, "userId required."],
    },
    // products: { type: [{ productSchema }], default: {} },
    products: [{
            productId: { type: mongoose_1.Schema.Types.ObjectId },
            quantity: { type: Number, default: 0 },
            price: { type: Number, default: 0 },
            optionId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'options' },
            flog: { type: String, default: "product" }
        }],
    dealofthedayId: [
        {
            dealId: { type: mongoose_1.Schema.Types.ObjectId, ref: "dealoftheday" },
            flog: { type: String, default: "dealOfDay" },
            quantity: { type: Number, default: 0 },
        },
    ],
    amount: { type: Number, default: 0 },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, { collection: "cart" });
//# sourceMappingURL=cart.js.map