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
const bcrypt_1 = __importDefault(require("bcrypt"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, _validation_1.validateSignup)(req.body);
        if (error)
            throw error;
        let users = yield _validation_1.SuperAdmin.findOne({
            mobileNumber: req.body.mobileNumber,
        });
        if (users) {
            return res.status(400).json({
                error: { mobileNumber: "Mobile Number already exists!." },
            });
        }
        let hashedPassword = "";
        if (req.body.password) {
            const saltRounds = 10;
            hashedPassword = yield bcrypt_1.default.hash(req.body.password, saltRounds);
        }
        let payload = {
            firstName: req.body.firstName || "",
            lastName: req.body.lastName || "",
            email: req.body.email || "",
            mobileNumber: req.body.mobileNumber,
            password: hashedPassword,
            role: "Customer",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        payload.authCode = req.body.password;
        let newUser = new _validation_1.SuperAdmin(payload);
        newUser = yield newUser.save();
        res.status(200).json({
            message: "Signup successful",
            user: newUser,
            status: 200,
        });
    }
    catch (err) {
        console.error(err);
        res.status(200).json({
            message: "Internal Server Error",
            error: err,
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error } = (0, _validation_1.validateLogin)(req.body);
    if (error)
        throw error;
    let users = yield _validation_1.SuperAdmin.findOne({
        email: req.body.email,
    });
    if (!users)
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again." });
    let hashedPassword = yield bcrypt_1.default.compare((_a = req.body) === null || _a === void 0 ? void 0 : _a.password, users === null || users === void 0 ? void 0 : users.password);
    if (!hashedPassword)
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again." });
    const token = yield users.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "SuperAdmin login successfully.", id: users._id, token: token });
});
exports.login = login;
//# sourceMappingURL=login.js.map