"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taxSchema = void 0;
const mongoose_1 = require("mongoose");
exports.taxSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    percentage: { type: Number, default: 0 },
    description: { type: String, default: "" },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, { collection: "tax" });
//# sourceMappingURL=tax.js.map