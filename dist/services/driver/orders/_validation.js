"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments = exports.Orders = void 0;
const mongoose_1 = require("mongoose");
const order_1 = require("../../../models/order");
const payment_1 = require("../../../models/payment");
exports.Orders = (0, mongoose_1.model)("Orders", order_1.orderSchema);
exports.Payments = (0, mongoose_1.model)("Payments", payment_1.paymentSchema);
//# sourceMappingURL=_validation.js.map