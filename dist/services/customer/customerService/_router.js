"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerService_1 = require("./customerService");
const router = (0, express_1.Router)();
router.post("/add", customerService_1.add);
exports.default = router;
//# sourceMappingURL=_router.js.map