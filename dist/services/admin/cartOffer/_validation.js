"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdate = exports.validateAdd = exports.FreeProduct = exports.CartOffer = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const cartOffer_1 = require("../../../models/cartOffer");
const freeProduct_1 = require("../../../models/freeProduct");
exports.CartOffer = (0, mongoose_1.model)("cartOffer", cartOffer_1.cartOffer);
exports.FreeProduct = (0, mongoose_1.model)("freeProduct", freeProduct_1.freeProductSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label("Name"),
        minPrice: joi_1.default.number().min(0).required().label("Min Price"),
        maxPrice: joi_1.default.number().min(0).required().label("Max Price"),
        freeProductId: joi_1.default.array().items(joi_1.default.string()).label("Free Product IDs"),
        isFreeDeliver: joi_1.default.number().valid(0, 1).default(0).label("Free Delivery"),
    });
    return schema.validate(data, { abortEarly: false, stripUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().optional().label("Name"),
        minPrice: joi_1.default.number().min(0).optional().label("Min Price"),
        maxPrice: joi_1.default.number().min(0).optional().label("Max Price"),
        freeProductId: joi_1.default.array().items(joi_1.default.string()).optional().label("Free Product IDs"),
        isFreeDeliver: joi_1.default.number().valid(0, 1).optional().label("Free Delivery"),
    });
    return schema.validate(data, { abortEarly: false, stripUnknown: true });
};
exports.validateUpdate = validateUpdate;
//# sourceMappingURL=_validation.js.map