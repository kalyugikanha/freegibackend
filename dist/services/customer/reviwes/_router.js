"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_1 = require("./reviews");
const router = (0, express_1.Router)();
router.post("/list", reviews_1.list);
router.post("/add", reviews_1.add);
exports.default = router;
//# sourceMappingURL=_router.js.map