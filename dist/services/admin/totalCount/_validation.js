"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.Payment = exports.Users = exports.Product = exports.Category = void 0;
const mongoose_1 = require("mongoose");
const category_1 = require("../../../models/category");
const product_1 = require("../../../models/product");
const users_1 = require("../../../models/users");
const payment_1 = require("../../../models/payment");
const order_1 = require("../../../models/order");
exports.Category = (0, mongoose_1.model)("Category", category_1.categorySchema);
exports.Product = (0, mongoose_1.model)("Product", product_1.productSchema);
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
exports.Payment = (0, mongoose_1.model)("Payment", payment_1.paymentSchema);
exports.Order = (0, mongoose_1.model)("Order", order_1.orderSchema);
//# sourceMappingURL=_validation.js.map