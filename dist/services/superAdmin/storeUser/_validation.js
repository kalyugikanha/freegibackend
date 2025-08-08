"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = exports.Users = void 0;
const mongoose_1 = require("mongoose");
const users_1 = require("../../../models/users");
const joi_1 = __importDefault(require("joi"));
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
const validateRegister = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().label("Email"),
        firstName: joi_1.default.string().required().label("Firstname"),
        lastName: joi_1.default.string().required().label("Lastname"),
        mobileNumber: joi_1.default.string().required().label("MobileNumber"),
        password: joi_1.default.string().required().label("password"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=_validation.js.map