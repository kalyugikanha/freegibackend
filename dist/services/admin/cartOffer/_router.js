"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartOffer_1 = require("./cartOffer");
// import { fileUpload } from "../../../helper/upload";
const router = (0, express_1.Router)();
router.get("/list", cartOffer_1.list);
router.post("/add", cartOffer_1.add);
router.put("/:id", cartOffer_1.update);
router.get("/:id", cartOffer_1.view);
router.delete("/:id", cartOffer_1.remove);
exports.default = router;
//# sourceMappingURL=_router.js.map