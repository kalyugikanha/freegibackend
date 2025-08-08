"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSelectDefault = exports.validateDelete = exports.validateUpdate = exports.validateAdd = exports.Address = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const address_1 = require("../../../models/address");
exports.Address = (0, mongoose_1.model)("Address", address_1.addressSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        tag: joi_1.default.string().required().label("Tag"),
        pincode: joi_1.default.string().required().label("pincode"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
        tag: joi_1.default.string().required().label("tag"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
const validateDelete = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateDelete = validateDelete;
const validateSelectDefault = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
        userId: joi_1.default.string().required().label("userId")
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateSelectDefault = validateSelectDefault;
//# sourceMappingURL=_validation.js.map