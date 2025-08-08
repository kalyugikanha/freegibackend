"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminSchema = void 0;
const mongoose_1 = require("mongoose");
const encription_1 = require("../helper/encription");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.superAdminSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    mobileNumber: { type: String, default: "" },
    gender: { type: String, default: "" },
    dob: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    password: { type: String, default: "" },
    authCode: { type: String, default: "" },
    isVerify: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "superAdmin" });
exports.superAdminSchema.methods.getAccessToken = function () {
    const token = jsonwebtoken_1.default.sign({ cid: this._id }, config_1.default.get("jwtPrivateKey"));
    return (0, encription_1.encrypt)(token);
};
//# sourceMappingURL=superAdmin.js.map