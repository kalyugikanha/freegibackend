"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateStatus = exports.validateUpdate = exports.validateAdd = exports.Product = exports.SubCategory = void 0;
const mongoose_1 = require("mongoose");
const subCategory_1 = require("../../../models/subCategory");
const joi_1 = __importDefault(require("joi"));
const product_1 = require("../../../models/product");
exports.SubCategory = (0, mongoose_1.model)("SubCategory", subCategory_1.subCategorySchema);
exports.Product = (0, mongoose_1.model)("Product", product_1.productSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label("Name"),
        category: joi_1.default.string().hex().length(24).required().label("category"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
        name: joi_1.default.string().required().label("Name"),
        category: joi_1.default.string().hex().length(24).required().label("category"),
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