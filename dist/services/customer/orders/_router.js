"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = require("./orders");
const router = (0, express_1.Router)();
router.post("/verifypayment", orders_1.verifyPayment);
router.post("/add", orders_1.add);
router.post("/detail", orders_1.detail);
router.post("/list", orders_1.list);
router.post("/update", orders_1.update);
router.post("/view", orders_1.view);
router.post("/cancelOrder", orders_1.cancelOrder);
router.post("/returnOrder", orders_1.returnOrder);
router.post("/exchangeOrder", orders_1.exchangeOrder);
router.post("/orderLocation", orders_1.orderLocation);
router.post("/recentOrder", orders_1.recentOrderList);
router.post("/mostOrder", orders_1.mostOrder);
exports.default = router;
//# sourceMappingURL=_router.js.map