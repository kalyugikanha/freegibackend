"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSchema = void 0;
const mongoose_1 = require("mongoose");
const encription_1 = require("../helper/encription");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.usersSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    storeName: { type: mongoose_1.Schema.Types.String, default: "" },
    storeAddress: { type: mongoose_1.Schema.Types.String, default: "" },
    ownerName: { type: mongoose_1.Schema.Types.String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    mobileNumber: { type: String, default: "" },
    gender: { type: String, default: "" },
    dob: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    otp: { type: Number, default: "" },
    password: { type: String, default: "" },
    role: { type: String, enum: ["Admin", "Customer", "DeliveryAgent"] },
    isVerify: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    authCode: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    pincode: { type: String, default: "" },
    isDelete: {
        type: Number,
        default: 0,
    },
    storeId: {
        type: mongoose_1.Schema.Types.ObjectId,
    }
}, { collection: "users" });
exports.usersSchema.methods.getAccessToken = function () {
    const token = jsonwebtoken_1.default.sign({ cid: this._id, storeId: (this === null || this === void 0 ? void 0 : this.storeId) || null }, config_1.default.get("jwtPrivateKey"));
    return (0, encription_1.encrypt)(token);
};
//# sourceMappingURL=users.js.map