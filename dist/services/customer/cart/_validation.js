"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRemove = exports.validateUpdate = exports.validateAdd = exports.Orders = exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const cart_1 = require("../../../models/cart");
const order_1 = require("../../../models/order");
exports.Cart = (0, mongoose_1.model)("Cart", cart_1.cartSchema);
exports.Orders = (0, mongoose_1.model)("Orders", order_1.orderSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        cid: joi_1.default.string().required().label("cid"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        userId: joi_1.default.string().required().label("userId"),
        id: joi_1.default.string().required().label("id"),
        productId: joi_1.default.string().required().label("productId"),
        optionId: joi_1.default.string().required().label("optionId"),
        quantity: joi_1.default.number().required().label("quantity"),
        price: joi_1.default.number().required().label("price")
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
const validateRemove = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().required().label("Cart ID"),
        userId: joi_1.default.string().required().label("User ID"),
        productId: joi_1.default.string().optional().label("Product ID"),
        optionId: joi_1.default.string().optional().label("Option ID"),
        dealOfTheDayId: joi_1.default.string().optional().label("Deal of the Day ID"),
    })
        .or("productId", "dealOfTheDayId")
        .with("productId", "optionId");
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateRemove = validateRemove;
//# sourceMappingURL=_validation.js.map