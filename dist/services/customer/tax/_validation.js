"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tax = void 0;
const mongoose_1 = require("mongoose");
const tax_1 = require("../../../models/tax");
exports.Tax = (0, mongoose_1.model)("Tax", tax_1.taxSchema);
//# sourceMappingURL=_validation.js.map