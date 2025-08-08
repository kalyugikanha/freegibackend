"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subCategorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.subCategorySchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Category required."],
        ref: "Category",
    },
    icon: { type: String, default: null },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "subCategory" });
//# sourceMappingURL=subCategory.js.map