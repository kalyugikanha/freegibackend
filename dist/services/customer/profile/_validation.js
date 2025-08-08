"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdate = exports.Address = exports.Users = void 0;
const mongoose_1 = require("mongoose");
const users_1 = require("../../../models/users");
const address_1 = require("../../../models/address");
const joi_1 = __importDefault(require("joi"));
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
exports.Address = (0, mongoose_1.model)("Address", address_1.addressSchema);
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID")
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
//# sourceMappingURL=_validation.js.map