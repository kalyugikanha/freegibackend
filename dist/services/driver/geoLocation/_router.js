"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geoLocation_1 = require("./geoLocation");
const router = (0, express_1.Router)();
router.post("/update", geoLocation_1.update);
router.post("/deliveryend", geoLocation_1.deliveryEnd);
exports.default = router;
//# sourceMappingURL=_router.js.map