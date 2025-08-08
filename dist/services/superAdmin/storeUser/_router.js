"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("./user");
const router = (0, express_1.Router)();
router.post("/register", user_1.register);
router.post("/", user_1.getUser);
router.get("/:id", user_1.getSingleUser);
router.put("/:id", user_1.update);
router.delete("/:id", user_1.deleteUser);
exports.default = router;
//# sourceMappingURL=_router.js.map