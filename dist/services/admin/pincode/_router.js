"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pincode_1 = require("./pincode");
const router = (0, express_1.Router)();
router.post("/add", pincode_1.add);
router.get("/", pincode_1.list);
router.put("/:id", pincode_1.update);
router.delete("/:id", pincode_1.deletePinCode);
exports.default = router;
//# sourceMappingURL=_router.js.map