"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const drivingLicense_1 = require("./drivingLicense");
const router = (0, express_1.Router)();
router.post("/add", drivingLicense_1.add);
router.post("/aadhar", drivingLicense_1.update);
router.post("/uploadImage", drivingLicense_1.uploadImage);
// router.post('/deleteImage', deleteImage);
exports.default = router;
//# sourceMappingURL=_router.js.map