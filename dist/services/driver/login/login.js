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
exports.login = exports.update = exports.verifyOtp = exports.signup = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateMobile)(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: { data: error === null || error === void 0 ? void 0 : error.message.replace(/\"/g, "").toString() } });
    let users = yield _validation_1.Users.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (users) {
        users.otp = 123456;
        users = yield users.save();
        res.status(200).json({ message: "OTP sent successfully." });
    }
    else {
        let payload = lodash_1.default.pick(req.body, ["mobileNumber"]);
        payload.role = "DeliveryAgent";
        payload.otp = 123456;
        let newUsers = new _validation_1.Users(payload);
        newUsers.createdAt = new Date().toISOString();
        newUsers.updatedAt = new Date().toISOString();
        newUsers = yield newUsers.save();
        res.status(200).json({ message: "OTP sent successfully." });
    }
});
exports.signup = signup;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateVerify)(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: { data: error === null || error === void 0 ? void 0 : error.message.replace(/\"/g, "").toString() } });
    let users = yield _validation_1.Users.findOne({
        mobileNumber: req.body.mobileNumber,
        otp: req.body.otp,
    });
    if (!users)
        return res.status(400).json({ message: "Verification Code not matched." });
    users.isVerify = true;
    // doctor.status = "success";
    users.updatedAt = new Date().toISOString();
    users = yield users.save();
    res.status(200).json({ message: "Delivery agent verified successfully." });
});
exports.verifyOtp = verifyOtp;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error } = (0, _validation_1.validateSignup)(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: { data: error === null || error === void 0 ? void 0 : error.message.replace(/\"/g, "").toString() } });
    let users = yield _validation_1.Users.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (!users)
        return res.status(404).json({ message: "No record found." });
    if (req.body.email) {
        let isEmailExist = yield _validation_1.Users.findOne({
            email: req.body.email,
            _id: {
                $ne: users._id,
            },
        });
        if (isEmailExist)
            return res.status(400).json({ message: "Email address already in use." });
    }
    users = lodash_1.default.assign(users, lodash_1.default.pick(req.body, ["email", "firstName", "lastName"]));
    let hashedPassword;
    if (req.body.password) {
        const saltRounds = 10;
        hashedPassword = yield bcrypt_1.default.hash(req.body.password, saltRounds);
    }
    users.password = hashedPassword || users.password,
        users.authCode = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.password) || users.authCode;
    users.updatedAt = new Date().toISOString();
    users = yield users.save();
    const token = yield users.getAccessToken();
    res
        .status(200)
        .json({
        token: token,
        id: users._id,
        message: "Delivery agent signup successfully.",
    });
});
exports.update = update;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateLogin)(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: { data: error === null || error === void 0 ? void 0 : error.message.replace(/\"/g, "").toString() } });
    let users = yield _validation_1.Users.findOne({
        email: req.body.email,
    });
    console.log(users);
    if (users == null) {
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again...." });
    }
    let password = yield bcrypt_1.default.compare(req.body.password, users.password);
    if (!password) {
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again...." });
    }
    if (users.isVerify != undefined && !users.isVerify) {
        return res
            .status(400)
            .json({ message: "Administrator is not verify your account contact with administrator" });
    }
    const token = yield users.getAccessToken();
    res
        .status(200)
        .json({
        token: token,
        id: users._id,
        message: "Delivery agent login successfully.",
    });
});
exports.login = login;
//# sourceMappingURL=login.js.map