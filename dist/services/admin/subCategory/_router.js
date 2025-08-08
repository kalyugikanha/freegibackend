"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subCategory_1 = require("./subCategory");
const router = (0, express_1.Router)();
router.post("/list", subCategory_1.list);
router.post("/category-vise-list", subCategory_1.categoryViseList);
router.post("/add", subCategory_1.add);
router.post("/update", subCategory_1.update);
router.post("/view", subCategory_1.view);
router.post("/changeStatus", subCategory_1.changeStatus);
router.post("/delete", subCategory_1.remove);
exports.default = router;
//# sourceMappingURL=_router.js.map