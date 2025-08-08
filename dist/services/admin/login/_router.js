"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("./login");
const router = (0, express_1.Router)();
router.post("/signup", login_1.signup);
router.post("/login", login_1.login);
exports.default = router;
//# sourceMappingURL=_router.js.map