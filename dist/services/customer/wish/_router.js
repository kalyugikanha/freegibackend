"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wish_1 = require("./wish");
const router = (0, express_1.Router)();
router.post("/add", wish_1.add);
router.post("/list", wish_1.list);
router.post("/remove", wish_1.remove);
exports.default = router;
//# sourceMappingURL=_router.js.map