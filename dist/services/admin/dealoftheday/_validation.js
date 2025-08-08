"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRemove = exports.validate = exports.Option = exports.Product = exports.dealoftheday = void 0;
const mongoose_1 = require("mongoose");
const dealoftheday_1 = require("../../../models/dealoftheday");
const product_1 = require("../../../models/product");
const joi_1 = __importDefault(require("joi"));
const option_1 = require("../../../models/option");
exports.dealoftheday = (0, mongoose_1.model)("dealoftheday", dealoftheday_1.dealofthedaySchema);
exports.Product = (0, mongoose_1.model)("Product", product_1.productSchema);
exports.Option = (0, mongoose_1.model)("option", option_1.optionSchema);
const validate = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string(),
        image: joi_1.default.string().uri(),
        price: joi_1.default.number(),
        description: joi_1.default.string(),
        products: joi_1.default.array().min(1).items(joi_1.default.object({
            productId: joi_1.default.string().required(),
            optionId: joi_1.default.string().required(),
        })).required(),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validate = validate;
const validateRemove = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("id"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateRemove = validateRemove;
//# sourceMappingURL=_validation.js.map