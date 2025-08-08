"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverGeoLocationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.driverGeoLocationSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    date: { type: Date, default: new Date().toISOString() },
    driver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    lat: { type: String, required: [true, "Lat required."] },
    long: { type: String, required: [true, "Long required."] },
}, { collection: "driverGeoLocation" });
//# sourceMappingURL=driverGeoLocation.js.map