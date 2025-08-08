"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartOffer = void 0;
const mongoose_1 = require("mongoose");
exports.cartOffer = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    freeGiftId: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'freeProduct' }],
    products: [{
            productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'product' },
            optionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'optionId' }
        }],
    minPrice: {
        type: Number,
        min: 0,
    },
    maxPrice: {
        type: Number,
        min: 0,
    },
    isFreeDeliver: {
        type: Number,
        default: 0
    },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "cartOffer" });
//# sourceMappingURL=cartOffer.js.map