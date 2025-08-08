"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_1 = require("./address");
const router = (0, express_1.Router)();
router.post("/add", address_1.add);
router.post("/list", address_1.list);
router.post("/update", address_1.update);
router.post("/remove", address_1.remove);
router.post("/default", address_1.selectDefault);
exports.default = router;
//# sourceMappingURL=_router.js.map