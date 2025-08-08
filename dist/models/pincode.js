"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pincodeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.pincodeSchema = new mongoose_1.Schema({
    pincode: {
        type: String,
        required: true
    },
    storeId: { type: mongoose_1.Schema.Types.ObjectId },
}, {
    collection: "pincode"
});
//# sourceMappingURL=pincode.js.map