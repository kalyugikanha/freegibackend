"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const mongoose_1 = require("mongoose");
exports.productSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    image: { type: String, default: "" },
    imageList: [{ type: String }],
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: mongoose_1.Schema.Types.ObjectId, ref: "SubCategory" },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    existingPrice: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: false,
        min: 0,
    },
    stock: {
        type: Number,
        required: false,
        min: 0,
    },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "product" });
//# sourceMappingURL=product.js.map