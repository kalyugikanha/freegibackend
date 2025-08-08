"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_1 = require("./cart");
const router = (0, express_1.Router)();
router.post("/add", cart_1.add);
router.post("/view", cart_1.view);
router.post("/recent-item", cart_1.recentCartItems);
router.post("/update", cart_1.update);
router.post("/remove", cart_1.remove);
router.post('/reorder', cart_1.reorder);
router.get("/couponList", cart_1.couponList);
router.post('/couponApply', cart_1.couponApply);
exports.default = router;
//# sourceMappingURL=_router.js.map