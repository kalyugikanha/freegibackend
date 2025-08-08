"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tax_1 = require("./tax");
const router = (0, express_1.Router)();
router.post("/list", tax_1.list);
router.post("/add", tax_1.add);
router.post("/update", tax_1.update);
router.post("/view", tax_1.view);
router.post("/changeStatus", tax_1.changeStatus);
router.post("/delete", tax_1.remove);
exports.default = router;
//# sourceMappingURL=_router.js.map