"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_1 = require("./customer");
const router = (0, express_1.Router)();
router.post("/list", customer_1.list);
router.post("/add", customer_1.add);
router.post("/update", customer_1.update);
router.post("/view", customer_1.view);
router.post("/delete", customer_1.remove);
// router.post('/deleteImage', deleteImage);
exports.default = router;
//# sourceMappingURL=_router.js.map