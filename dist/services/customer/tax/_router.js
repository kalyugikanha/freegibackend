"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tax_1 = require("./tax");
const router = (0, express_1.Router)();
router.post("/list", tax_1.list);
exports.default = router;
//# sourceMappingURL=_router.js.map