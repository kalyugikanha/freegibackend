"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinCode = void 0;
const mongoose_1 = require("mongoose");
const pincode_1 = require("../../../models/pincode");
exports.PinCode = (0, mongoose_1.model)("pincode", pincode_1.pincodeSchema);
//# sourceMappingURL=_validation.js.map