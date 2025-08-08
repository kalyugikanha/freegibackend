"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRemove = exports.validate = exports.Product = exports.featureditem = void 0;
const mongoose_1 = require("mongoose");
const featureditem_1 = require("../../../models/featureditem");
const product_1 = require("../../../models/product");
const joi_1 = __importDefault(require("joi"));
exports.featureditem = (0, mongoose_1.model)("featureditem", featureditem_1.featureditemSchema);
exports.Product = (0, mongoose_1.model)("Product", product_1.productSchema);
const validate = (data) => {
    const schema = joi_1.default.object({
        productIds: joi_1.default.array().required().label("productIds"),
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