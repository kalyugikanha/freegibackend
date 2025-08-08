"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = require("./category");
const router = (0, express_1.Router)();
router.post("/list", category_1.list);
router.post("/add", category_1.add);
router.put("/update", category_1.update);
router.post("/view", category_1.view);
router.post("/changeStatus", category_1.changeStatus);
router.post("/delete", category_1.remove);
router.post("/uploadImage", category_1.uploadImage);
// router.post('/deleteImage', deleteImage);
exports.default = router;
//# sourceMappingURL=_router.js.map