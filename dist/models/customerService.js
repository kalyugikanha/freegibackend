"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerServicesSchema = void 0;
const mongoose_1 = require("mongoose");
exports.customerServicesSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    email: { type: String, default: "" },
    mobileNumber: { type: String, default: "" },
    feedback: { type: String, default: "" },
    bookingId: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, { collection: "customerservices" });
//# sourceMappingURL=customerService.js.map