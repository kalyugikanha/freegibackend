"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const couponCode_1 = require("./couponCode");
const router = (0, express_1.Router)();
router.post("/list", couponCode_1.list);
exports.default = router;
//# sourceMappingURL=_router.js.map