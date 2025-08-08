"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.optionSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    mass: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, {
    collection: "option"
});
//# sourceMappingURL=option.js.map