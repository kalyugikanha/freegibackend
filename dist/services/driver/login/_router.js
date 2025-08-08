"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("./login");
const router = (0, express_1.Router)();
router.post("/signup", login_1.signup);
router.post("/verifyOtp", login_1.verifyOtp);
router.post("/update", login_1.update);
router.post("/login", login_1.login);
exports.default = router;
//# sourceMappingURL=_router.js.map