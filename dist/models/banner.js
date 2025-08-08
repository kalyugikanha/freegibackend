"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerSchema = void 0;
const mongoose_1 = require("mongoose");
exports.bannerSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    image: { type: String, default: null },
    description: { type: String, default: "" },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "banner" });
//# sourceMappingURL=banner.js.map