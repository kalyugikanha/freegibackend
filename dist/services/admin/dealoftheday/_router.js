"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dealoftheday_1 = require("./dealoftheday");
const router = (0, express_1.Router)();
router.get("/list", dealoftheday_1.list);
router.post("/add", dealoftheday_1.add);
router.put("/:id", dealoftheday_1.update);
router.delete("/:id", dealoftheday_1.remove);
router.get("/:id", dealoftheday_1.getDetails);
exports.default = router;
//# sourceMappingURL=_router.js.map