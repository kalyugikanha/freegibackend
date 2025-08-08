"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealofthedaySchema = void 0;
const mongoose_1 = require("mongoose");
exports.dealofthedaySchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: mongoose_1.Schema.Types.String },
    image: { type: mongoose_1.Schema.Types.String },
    price: { type: mongoose_1.Schema.Types.Number },
    description: { type: mongoose_1.Schema.Types.String },
    products: [
        {
            productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
            optionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "option" },
        },
    ],
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "dealoftheday" });
//# sourceMappingURL=dealoftheday.js.map