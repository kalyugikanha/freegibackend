"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishSchema = void 0;
const mongoose_1 = require("mongoose");
exports.wishSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    productId: [{
            type: mongoose_1.Schema.Types.ObjectId
        }],
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, { collection: "wish" });
//# sourceMappingURL=wish.js.map