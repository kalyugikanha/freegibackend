"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dealOfTheDay_1 = require("./dealOfTheDay");
const router = (0, express_1.Router)();
router.post("/list", dealOfTheDay_1.list);
exports.default = router;
//# sourceMappingURL=_router.js.map