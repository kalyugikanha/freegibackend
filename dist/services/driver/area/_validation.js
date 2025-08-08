"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateUpdate = exports.validateAdd = exports.Area = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const area_1 = require("../../../models/area");
exports.Area = (0, mongoose_1.model)("Area", area_1.areaSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label("name"),
        pincode: joi_1.default.string().required().label("pincode"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
        name: joi_1.default.string().required().label("name"),
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
//# sourceMappingURL=_validation.js.map