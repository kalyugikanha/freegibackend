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
exports.pincodeUpdate = exports.login = exports.update = exports.verifyOtp = exports.signup = void 0;
const _validation_1 = require("./_validation");
// import Crypto from "crypto";
const lodash_1 = __importDefault(require("lodash"));
// import { decrypt, encrypt } from "../../../helper/encription";
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { error } = validateMobile(req.body);
        // if (error) throw error;
        let users = yield _validation_1.Users.findOne({
            mobileNumber: req.body.mobileNumber,
        });
        if (users) {
            return res.status(400).json({
                error: { mobileNumber: "Mobile Number already exists!." },
            });
        }
        // let hashedPassword = "";
        // if (req.body.password) {
        //   const saltRounds = 10;
        //   hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        // }
        // let pinCodeExist=await PinCode.findOne({
        //   pincode:req.body.pincode
        // })
        // if(!pinCodeExist){
        //   return res.status(400).json({
        //     error: { pincode: "Pincode does not exist!." },
        //   });
        // }
        // password:hashedPassword ,
        // storeId:pinCodeExist?.storeId,
        let payload = {
            firstName: req.body.firstName || "",
            lastName: req.body.lastName || "",
            email: req.body.email || "",
            mobileNumber: req.body.mobileNumber,
            role: "Customer",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        payload.otp = 123456;
        let newUser = new _validation_1.Users(payload);
        newUser = yield newUser.save();
        res.status(200).json({
            message: "OTP sent successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});
exports.signup = signup;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateVerify)(req.body);
    if (error)
        throw error;
    let users = yield _validation_1.Users.findOne({
        mobileNumber: req.body.mobileNumber,
        otp: req.body.otp,
    });
    if (!users)
        return res.status(400).json({ message: "Verification Code not matched." });
    users.verificationCode = "";
    // doctor.status = "success";
    users.updatedAt = new Date().toISOString();
    users = yield users.save();
    res.status(200).json({ message: "Customer verified successfully." });
});
exports.verifyOtp = verifyOtp;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let users = yield _validation_1.Users.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (!users)
        return res.status(404).json({ message: "No record found." });
    if (req.body.email) {
        const isEmailExist = yield _validation_1.Users.findOne({
            email: req.body.email,
            _id: {
                $ne: users._id,
            },
        });
        if (isEmailExist) {
            return res.status(400).json({ message: "Email address already in use." });
        }
    }
    users = lodash_1.default.assign(users, lodash_1.default.pick(req.body, ["email", "firstName", "lastName",]));
    let hashedPassword;
    if (req.body.password) {
        const saltRounds = 10;
        hashedPassword = yield bcrypt_1.default.hash(req.body.password, saltRounds);
    }
    // let pinCodeExist=await PinCode.findOne({
    //   pincode:req.body.pincode
    // })
    // if(!pinCodeExist){
    //   return res.status(400).json({
    //     error: { pincode: "Pincode does not exist!." },
    //   });
    // }
    users.password = hashedPassword ? hashedPassword : users.password,
        // users.storeId=pinCodeExist?.storeId,
        users.authCode = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.password) || users.authCode;
    users.updatedAt = new Date().toISOString();
    users = yield users.save();
    const token = yield users.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "Customer Update successfully." });
});
exports.update = update;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateLogin)(req.body);
    if (error)
        throw error;
    let users = yield _validation_1.Users.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (!users)
        return res.status(400).json({
            message: "Invalid Mobile number or password! Please try again.",
        });
    let password = yield bcrypt_1.default.compare(req.body.password, users.password);
    if (!password)
        return res.status(400).json({
            message: "Invalid Mobile number or password! Please try again.",
        });
    //     if (req.body.pincode) {
    //       let pinCodeExist = await PinCode.findOne({ pincode:req.body.pincode });
    //       if (!pinCodeExist) {
    //         return res.status(400).json({
    //           error: { pincode: 'Pincode does not exist!' },
    //         });
    //       }
    //     if (
    //       !users.storeId || 
    //       users.storeId.toString() !== new mongoose.Types.ObjectId(pinCodeExist.storeId).toString()
    //     ) {
    //       users.storeId = new mongoose.Types.ObjectId(pinCodeExist.storeId);
    //     }
    //     users.pincode = req.body.pincode;
    //   users.updatedAt = new Date();
    //   await users.save();
    // }
    const token = yield users.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "Customer login successfully.", id: users._id, token: token });
});
exports.login = login;
const pincodeUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // res.json({
    //   data:req.body?.cid
    // })
    let pinCodeExist = yield _validation_1.PinCode.findOne({
        pincode: (_b = req.body) === null || _b === void 0 ? void 0 : _b.pincode
    });
    if (!pinCodeExist) {
        return res.status(400).json({
            error: { pincode: "No service is available for this pincode." },
        });
    }
    let users = yield _validation_1.Users.findOne({
        _id: new mongoose_1.default.Types.ObjectId(req.body.cid)
    });
    if (!users.storeId ||
        users.storeId.toString() !== new mongoose_1.default.Types.ObjectId(pinCodeExist.storeId).toString()) {
        users.storeId = new mongoose_1.default.Types.ObjectId(pinCodeExist.storeId);
        users.pincode = req.body.pincode;
    }
    // users.password = await bcrypt.hash(req.body.password,10);
    // users.authCode=req.body.password
    users.updatedAt = new Date().toISOString();
    users = yield users.save();
    const token = yield users.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "Customer login successfully.", id: users._id, token: token });
});
exports.pincodeUpdate = pincodeUpdate;
//# sourceMappingURL=login.js.map