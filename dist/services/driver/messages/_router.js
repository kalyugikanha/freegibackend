"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_1 = require("./message");
const router = (0, express_1.Router)();
router.post("/list", message_1.list);
exports.default = router;
//# sourceMappingURL=_router.js.map