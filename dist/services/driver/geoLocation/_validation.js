"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeliveryEnd = exports.validateAdd = exports.Orders = exports.DriverGeoLocation = void 0;
const mongoose_1 = require("mongoose");
const driverGeoLocation_1 = require("../../../models/driverGeoLocation");
const joi_1 = __importDefault(require("joi"));
const order_1 = require("../../../models/order");
exports.DriverGeoLocation = (0, mongoose_1.model)("DriverGeoLocation", driverGeoLocation_1.driverGeoLocationSchema);
exports.Orders = (0, mongoose_1.model)("Orders", order_1.orderSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        lat: joi_1.default.string().required().label("Lat"),
        long: joi_1.default.string().required().label("Long"),
        orderId: joi_1.default.string().required().label("orderId"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateDeliveryEnd = (data) => {
    const schema = joi_1.default.object({
        orderId: joi_1.default.string().required().label("orderId"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateDeliveryEnd = validateDeliveryEnd;
//# sourceMappingURL=_validation.js.map