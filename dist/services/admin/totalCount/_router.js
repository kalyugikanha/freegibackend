"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const count_1 = require("./count");
const router = (0, express_1.Router)();
router.post("/list", count_1.list);
// router.post('/deleteImage', deleteImage);
exports.default = router;
//# sourceMappingURL=_router.js.map