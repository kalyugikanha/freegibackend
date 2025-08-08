"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = require("./orders");
const router = (0, express_1.Router)();
router.post("/dashboard", orders_1.OrderCountApi);
router.post("/activeOrder", orders_1.activeOrder);
router.post("/list", orders_1.list);
router.post("/order-history", orders_1.OrderHistory);
router.put('/cancelOrder', orders_1.cancelOrder);
router.put('/cashPayment', orders_1.cashPaymentOrder);
router.put('/update', orders_1.cashPaymentOrder);
router.post('/update', orders_1.updateStatus);
exports.default = router;
//# sourceMappingURL=_router.js.map