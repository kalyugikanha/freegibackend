"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const mongoose_1 = require("mongoose");
const orderProductSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, default: 0 },
    optionId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'options' },
    flog: { type: String, default: "product" }
}, { _id: false });
exports.orderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    products: { type: [orderProductSchema], required: true },
    dealofthedays: [
        {
            dealId: { type: mongoose_1.Schema.Types.ObjectId, ref: "dealoftheday" },
            flog: { type: String, default: "dealOfDay" },
            quantity: { type: Number, default: 0 },
        },
    ],
    cartOffer: {
        cartOfferId: { type: mongoose_1.Schema.Types.ObjectId },
        type: { type: String, enum: ["product", "freeGift"] },
        productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "product" },
        optionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "option" },
        freeGiftId: { type: mongoose_1.Schema.Types.ObjectId, ref: "freeProduct" }
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "CouponCode",
        default: null,
    },
    paymentMethod: { type: String, default: "" },
    deliveryAgent: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", default: null },
    tax: { type: mongoose_1.Schema.Types.ObjectId, ref: "Tax", default: null },
    paymentStatus: { type: String, default: "" },
    orderDate: { type: Date, default: null },
    deliveryDate: { type: Date, default: null },
    deliveryInstruction: { type: String, default: "" },
    address: { type: mongoose_1.Schema.Types.ObjectId, ref: "Address" },
    notes: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    reason: [{ type: String }],
    description: { type: String },
    image: { type: String },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, { collection: "orders" });
//# sourceMappingURL=order.js.map