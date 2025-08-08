"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = require("./product");
// import { fileUpload } from "../../../helper/upload";
const router = (0, express_1.Router)();
router.post("/list", product_1.list);
router.post("/add", product_1.add);
router.post("/update", product_1.update);
router.post("/view", product_1.view);
router.post("/changeStatus", product_1.changeStatus);
router.post("/delete", product_1.remove);
router.post("/uploadImage", product_1.uploadImage);
// router.post('/deleteImage', deleteImage);
exports.default = router;
//# sourceMappingURL=_router.js.map