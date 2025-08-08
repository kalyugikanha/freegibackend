"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const featureditem_1 = require("./featureditem");
const router = (0, express_1.Router)();
router.get("/list", featureditem_1.list);
router.post("/add", featureditem_1.add);
router.post("/delete", featureditem_1.remove);
exports.default = router;
//# sourceMappingURL=_router.js.map