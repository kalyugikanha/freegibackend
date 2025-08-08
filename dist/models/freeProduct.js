"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeProductSchema = void 0;
const mongoose_1 = require("mongoose");
exports.freeProductSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    image: { type: String, default: "" },
    price: {
        type: Number,
        min: 0,
    },
    stock: {
        type: Number,
        min: 0,
    },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "freeProduct" });
//# sourceMappingURL=freeProduct.js.map