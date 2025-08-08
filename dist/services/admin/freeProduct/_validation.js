"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdate = exports.validateAdd = exports.FreeProduct = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const freeProduct_1 = require("../../../models/freeProduct");
exports.FreeProduct = (0, mongoose_1.model)("freeProduct", freeProduct_1.freeProductSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label("Name"),
        // price: Joi.number().required().label("Price"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label("Name"),
        // price: Joi.number().required().label("Price"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
//# sourceMappingURL=_validation.js.map