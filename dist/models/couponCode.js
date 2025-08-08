"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponCodeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.couponCodeSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    code: { type: String, default: "" },
    type: { type: String },
    minPrice: { type: Number, default: 0 },
    maxPrice: { type: Number, default: 0 },
    endDate: { type: Date },
    limit: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "couponCode" });
//# sourceMappingURL=couponCode.js.map