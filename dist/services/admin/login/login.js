"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateSignup)(req.body);
    if (error)
        throw error;
    let users = yield _validation_1.Users.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (users)
        return res
            .status(400)
            .json({ error: { mobileNumber: "Mobile Number is already exist!." } });
    let payload = lodash_1.default.pick(req.body, [
        "mobileNumber",
        "firstName",
        "lastName",
        "email",
    ]);
    payload.role = "Admin";
    payload.otp = 123456;
    payload.password = yield bcrypt_1.default.hash(req.body.password, 10);
    payload.authCode = req.body.password;
    const objectId = new mongoose_1.default.Types.ObjectId();
    payload.storeId = objectId;
    let newUsers = new _validation_1.Users(payload);
    newUsers.createdAt = new Date().toISOString();
    newUsers.updatedAt = new Date().toISOString();
    newUsers = yield newUsers.save();
    res.status(200).json({ message: "Admin signup successfully." });
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateLogin)(req.body);
    if (error)
        throw error;
    let users = yield _validation_1.Users.findOne({
        email: req.body.email,
        isDelete: 0,
        role: "Admin",
        isVerify: true,
    });
    if (!users)
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again." });
    let password = yield bcrypt_1.default.compare(req.body.password, users.password);
    if (!password)
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again." });
    const token = yield users.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "Admin login successfully.", id: users._id, token: token });
});
exports.login = login;
//# sourceMappingURL=login.js.map