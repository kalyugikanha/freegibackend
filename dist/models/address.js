"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.addressSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    tag: { type: String, required: [true, "tag required."] },
    addressType: { type: String },
    floor: { type: String },
    address: { type: String, default: null },
    landMark: { type: String },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users" },
    pincode: { type: String, default: "" },
    lat: { type: String, default: "" },
    long: { type: String, default: "" },
    status: { type: String, default: "enable", enum: ["enable", "disable"] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    default: { type: Boolean, default: false }
}, { collection: "address" });
//# sourceMappingURL=address.js.map