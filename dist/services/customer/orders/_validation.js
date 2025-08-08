"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrderLocation = exports.generateAutoID = exports.Users = exports.wallet = exports.Cart = exports.DriverGeoLocation = exports.Payments = exports.Orders = void 0;
const mongoose_1 = require("mongoose");
const order_1 = require("../../../models/order");
const payment_1 = require("../../../models/payment");
const driverGeoLocation_1 = require("../../../models/driverGeoLocation");
const joi_1 = __importDefault(require("joi"));
const cart_1 = require("../../../models/cart");
const wallet_1 = require("../../../models/wallet");
const users_1 = require("../../../models/users");
exports.Orders = (0, mongoose_1.model)("Orders", order_1.orderSchema);
exports.Payments = (0, mongoose_1.model)("Payments", payment_1.paymentSchema);
exports.DriverGeoLocation = (0, mongoose_1.model)("DriverGeoLocation", driverGeoLocation_1.driverGeoLocationSchema);
exports.Cart = (0, mongoose_1.model)("Cart", cart_1.cartSchema);
exports.wallet = (0, mongoose_1.model)("wallet", wallet_1.walletSchema);
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
function generateAutoID(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }
    return result;
}
exports.generateAutoID = generateAutoID;
const validateOrderLocation = (data) => {
    const schema = joi_1.default.object({
        orderId: joi_1.default.string().required().label("orderId")
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateOrderLocation = validateOrderLocation;
//# sourceMappingURL=_validation.js.map