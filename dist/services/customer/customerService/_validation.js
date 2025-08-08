"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdd = exports.customerServices = void 0;
const mongoose_1 = require("mongoose");
const customerService_1 = require("../../../models/customerService");
const joi_1 = __importDefault(require("joi"));
exports.customerServices = (0, mongoose_1.model)("customerServices", customerService_1.customerServicesSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        userId: joi_1.default.string().required().label("userId"),
        email: joi_1.default.string().required().label("email"),
        mobileNumber: joi_1.default.string().required().label("mobileNumber"),
        feedback: joi_1.default.string().required().label("feedback")
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
//# sourceMappingURL=_validation.js.map