"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const couponCode_1 = require("./couponCode");
const router = (0, express_1.Router)();
router.post("/list", couponCode_1.list);
router.post("/add", couponCode_1.add);
router.post("/update", couponCode_1.update);
router.post("/view", couponCode_1.view);
router.post("/changeStatus", couponCode_1.changeStatus);
router.post("/delete", couponCode_1.remove);
exports.default = router;
//# sourceMappingURL=_router.js.map