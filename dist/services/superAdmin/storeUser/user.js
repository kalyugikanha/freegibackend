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
exports.getSingleUser = exports.deleteUser = exports.update = exports.getUser = exports.register = void 0;
const _validation_1 = require("./_validation");
// import Crypto from "crypto";
const lodash_1 = __importDefault(require("lodash"));
// import { decrypt, encrypt } from "../../../helper/encription";
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { error } = validateRegister(req.body);
        // if (error) throw error;
        let users = yield _validation_1.Users.findOne({
            isDelete: 0,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            role: "Admin"
        });
        if (users) {
            return res.status(400).json({
                message: "User already exists!",
            });
        }
        let hashedPassword = "";
        if (req.body.password) {
            const saltRounds = 10;
            hashedPassword = yield bcrypt_1.default.hash(req.body.password, saltRounds);
        }
        let payload = {
            storeName: req.body.storeName,
            storeAddress: req.body.storeAddress,
            ownerName: req.body.ownerName,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            password: hashedPassword,
            role: "Admin",
            isVerify: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const objectId = new mongoose_1.default.Types.ObjectId();
        payload.authCode = req.body.password;
        payload.storeId = objectId;
        let newUser = new _validation_1.Users(payload);
        newUser = yield newUser.save();
        res.status(200).json({
            message: "Store created successfully.",
            user: newUser,
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ error: "Something went wrong!" });
    }
});
exports.register = register;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, limit } = req.body;
    let users = yield _validation_1.Users.find({
        isDelete: 0,
        role: "Admin"
    }).select("-gender -firstName -lastName -dob").skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
    let totalUsers = yield _validation_1.Users.countDocuments({
        isDelete: 0,
        role: "Admin"
    });
    res.status(200).json({ data: {
            users: users,
            totalUsers: totalUsers
        }, status: 200 });
});
exports.getUser = getUser;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let users = yield _validation_1.Users.findOne({
        _id: {
            $eq: id,
        },
        isDelete: 0,
        role: "Admin"
    });
    if (req.body.mobileNumber) {
        let checkMobile = yield _validation_1.Users.findOne({
            _id: {
                $ne: id,
            },
            isDelete: 0,
            mobileNumber: req.body.mobileNumber,
            role: "Admin"
        });
        if (checkMobile) {
            return res.status(400).json({ message: "Mobile Number already exists.", status: 400 });
        }
    }
    if (req.body.email) {
        let isEmailExist = yield _validation_1.Users.findOne({
            _id: {
                $ne: id,
            },
            isDelete: 0,
            role: "Admin",
            email: req.body.email,
        });
        if (isEmailExist)
            return res.status(400).json({ message: "Email address already in use.", status: 400 });
    }
    users = lodash_1.default.assign(users, lodash_1.default.pick(req.body, ["email", 'mobileNumber', 'storeName', 'storeAddress', 'ownerName', 'isVerify']));
    users.updatedAt = new Date().toISOString();
    users = yield users.save();
    res.status(200).json({ message: "Store updated successfully.", status: 200, data: users });
});
exports.update = update;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.params.id;
        // Check if the user exists
        let user = yield _validation_1.Users.findOne({
            _id: id,
            isDelete: 0,
            role: "Admin" // Only admins can delete users
        });
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }
        // Update user to mark as deleted
        yield _validation_1.Users.findByIdAndUpdate(id, { isDelete: 1 }, { new: true }).exec();
        return res.status(200).json({
            message: "Store deleted successfully",
            // user: updatedUser
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal server error", });
    }
});
exports.deleteUser = deleteUser;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let user = yield _validation_1.Users.findOne({
        _id: id,
        isDelete: 0,
        role: "Admin"
    }).select("-gender -firstName -lastName -dob");
    res.status(200).json({ user: user || {}, status: 200 });
});
exports.getSingleUser = getSingleUser;
//# sourceMappingURL=user.js.map