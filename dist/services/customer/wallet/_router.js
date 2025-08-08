"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_1 = require("./wallet");
const router = (0, express_1.Router)();
router.post("/add", wallet_1.add);
router.post("/verifyPayment", wallet_1.verifyPayment);
router.post("/amountDetail", wallet_1.amountDetail);
router.post("/list", wallet_1.list);
exports.default = router;
//# sourceMappingURL=_router.js.map