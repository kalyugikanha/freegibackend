"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const freeProduct_1 = require("./freeProduct");
// import { fileUpload } from "../../../helper/upload";
const router = (0, express_1.Router)();
router.get("/list", freeProduct_1.list);
router.post("/add", freeProduct_1.add);
router.put("/:id", freeProduct_1.update);
router.get("/:id", freeProduct_1.view);
router.delete("/:id", freeProduct_1.remove);
router.post("/uploadImage", freeProduct_1.uploadImage);
// router.post('/deleteImage', deleteImage);
exports.default = router;
//# sourceMappingURL=_router.js.map