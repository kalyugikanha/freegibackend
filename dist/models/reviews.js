"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const mongoose_1 = require("mongoose");
exports.reviewSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "product", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, default: "" },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
    createdAt: { type: Date, default: new Date().toISOString() },
}, { collection: "reviews" });
//# sourceMappingURL=reviews.js.map