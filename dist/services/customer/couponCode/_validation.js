"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponCode = void 0;
const mongoose_1 = require("mongoose");
const couponCode_1 = require("../../../models/couponCode");
exports.CouponCode = (0, mongoose_1.model)("CouponCode", couponCode_1.couponCodeSchema);
//# sourceMappingURL=_validation.js.map