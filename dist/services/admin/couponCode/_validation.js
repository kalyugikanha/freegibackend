"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateStatus = exports.validateUpdate = exports.validateAdd = exports.CouponCode = void 0;
const mongoose_1 = require("mongoose");
const couponCode_1 = require("../../../models/couponCode");
const joi_1 = __importDefault(require("joi"));
exports.CouponCode = (0, mongoose_1.model)("CouponCode", couponCode_1.couponCodeSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label("Name"),
        code: joi_1.default.string().required().label("Code"),
        type: joi_1.default.string().valid("percentage", "rupees").optional().label("Type"),
        minPrice: joi_1.default.number().min(0).default(0).optional().label("Min Price"),
        maxPrice: joi_1.default.number().min(0).default(0).optional().label("Max Price"),
        endDate: joi_1.default.date().optional().label("End Date"),
        limit: joi_1.default.number().integer().min(0).default(0).optional().label("Usage Limit"),
        discount: joi_1.default.number().min(0).required().label("Discount"),
        status: joi_1.default.string().valid("enable", "disable").default("enable").optional().label("Status"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
        name: joi_1.default.string().optional().label("Name"),
        code: joi_1.default.string().optional().label("Code"),
        type: joi_1.default.string().valid("percentage", "rupees").optional().label("Type"),
        minPrice: joi_1.default.number().min(0).optional().label("Min Price"),
        maxPrice: joi_1.default.number().min(joi_1.default.ref("minPrice")).optional().label("Max Price"),
        endDate: joi_1.default.date().optional().label("End Date"),
        limit: joi_1.default.number().integer().min(0).optional().label("Usage Limit"),
        discount: joi_1.default.number().min(0).optional().label("Discount"),
        status: joi_1.default.string().valid("enable", "disable").optional().label("Status"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
const validateStatus = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
        status: joi_1.default.string().required().label("Status"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateStatus = validateStatus;
const validateDelete = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateDelete = validateDelete;
//# sourceMappingURL=_validation.js.map