"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drivingLicenceSchema = void 0;
const mongoose_1 = require("mongoose");
exports.drivingLicenceSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    image: { type: String, default: null },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users" },
    status: {
        type: String,
        enum: ["pending", "verified", "cancelled"],
        default: "pending",
    },
    aadhar: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, { collection: "drivingLicence" });
//# sourceMappingURL=drivingLicence.js.map