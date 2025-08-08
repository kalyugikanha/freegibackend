"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = void 0;
const mongoose_1 = require("mongoose");
const reviews_1 = require("../../../models/reviews");
exports.Reviews = (0, mongoose_1.model)("Reviews", reviews_1.reviewSchema);
//# sourceMappingURL=_validation.js.map