"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdd = exports.validate = exports.Users = exports.wallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_1 = require("../../../models/wallet");
const users_1 = require("../../../models/users");
const joi_1 = __importDefault(require("joi"));
exports.wallet = (0, mongoose_1.model)("wallet", wallet_1.walletSchema);
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
const validate = (data) => {
    const schema = joi_1.default.object({
        userId: joi_1.default.string().required().label("userId")
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validate = validate;
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        userId: joi_1.default.string().required().label("userId"),
        amount: joi_1.default.number().required().label("amount"),
        orderId: joi_1.default.string().required().label("orderId"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
//# sourceMappingURL=_validation.js.map