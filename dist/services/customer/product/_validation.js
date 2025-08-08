"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const product_1 = require("../../../models/product");
exports.Product = (0, mongoose_1.model)("Product", product_1.productSchema);
//# sourceMappingURL=_validation.js.map