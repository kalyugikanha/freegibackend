"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = require("./product");
const router = (0, express_1.Router)();
router.post("/list", product_1.list);
router.post("/search", product_1.search);
exports.default = router;
//# sourceMappingURL=_router.js.map