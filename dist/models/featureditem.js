"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureditemSchema = void 0;
const mongoose_1 = require("mongoose");
exports.featureditemSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    productId: { type: mongoose_1.Schema.Types.ObjectId },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "featureditem" });
//# sourceMappingURL=featureditem.js.map