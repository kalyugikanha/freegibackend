"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const banner_1 = require("./banner");
const router = (0, express_1.Router)();
router.post("/list", banner_1.list);
router.post("/add", banner_1.add);
router.post("/update", banner_1.update);
router.post("/view", banner_1.view);
router.post("/changeStatus", banner_1.changeStatus);
router.post("/delete", banner_1.remove);
router.post("/uploadImage", banner_1.uploadImage);
// router.post('/deleteImage', deleteImage);
exports.default = router;
//# sourceMappingURL=_router.js.map