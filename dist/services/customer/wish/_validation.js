"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateList = exports.wish = void 0;
const mongoose_1 = require("mongoose");
const wish_1 = require("../../../models/wish");
const joi_1 = __importDefault(require("joi"));
exports.wish = (0, mongoose_1.model)("wish", wish_1.wishSchema);
const validateList = (data) => {
    const schema = joi_1.default.object({
        userId: joi_1.default.string().required().label("userId")
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateList = validateList;
const validate = (data) => {
    const schema = joi_1.default.object({
        userId: joi_1.default.string().required().label("userId"),
        productId: joi_1.default.string().required().label("productId")
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validate = validate;
//# sourceMappingURL=_validation.js.map