"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const area_1 = require("./area");
const router = (0, express_1.Router)();
router.post("/add", area_1.add);
router.post("/list", area_1.list);
router.post("/update", area_1.update);
router.post("/remove", area_1.remove);
exports.default = router;
//# sourceMappingURL=_router.js.map