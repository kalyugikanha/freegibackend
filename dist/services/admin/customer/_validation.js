"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateStatus = exports.validateUpdate = exports.validateAdd = exports.Users = void 0;
const mongoose_1 = require("mongoose");
const users_1 = require("../../../models/users");
const joi_1 = __importDefault(require("joi"));
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label("Firstname"),
        lastName: joi_1.default.string().required().label("lastName"),
        email: joi_1.default.string().email().required().label("email"),
        password: joi_1.default.string().required().label("password"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
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