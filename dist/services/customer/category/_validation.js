"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const category_1 = require("../../../models/category");
exports.Category = (0, mongoose_1.model)("Category", category_1.categorySchema);
//# sourceMappingURL=_validation.js.map