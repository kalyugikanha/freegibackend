"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const order_1 = require("../../../models/order");
exports.Order = (0, mongoose_1.model)("Order", order_1.orderSchema);
//# sourceMappingURL=_validation.js.map