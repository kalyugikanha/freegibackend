"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subCategory_1 = require("./subCategory");
const router = (0, express_1.Router)();
router.post("/list", subCategory_1.list);
exports.default = router;
//# sourceMappingURL=_router.js.map