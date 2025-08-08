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
exports.logout = exports.update = exports.view = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // let users: any = await Users.findOne({ _id: req.body.cid }).select({
    //   password: 0,
    //   otp: 0,
    // });
    let users = yield _validation_1.Users.findOne({ _id: new mongoose_1.default.Types.ObjectId(req.body.cid) });
    if (!users)
        return res.status(400).json({ message: "No record found." });
    let address = yield _validation_1.Address.findOne({ userId: users._id, default: true });
    res.status(200).json({ data: users, address: address });
});
exports.view = view;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let user = yield _validation_1.Users.findOne({ _id: req.body.id });
    if (!user)
        return res.status(400).json({ message: "No record found." });
    if (req.body.firstName)
        user.firstName = req.body.firstName;
    if (req.body.lastName)
        user.lastName = req.body.lastName;
    if (req.body.email)
        user.email = req.body.email;
    if (req.body.mobileNumber)
        user.mobileNumber = req.body.mobileNumber;
    if (req.body.gender)
        user.gender = req.body.gender;
    if (req.body.dob)
        user.dob = req.body.dob;
    if (req.body.profilePic)
        user.profilePic = req.body.profilePic;
    user = yield user.save();
    res.status(200).json({ message: "User updated successfully." });
});
exports.update = update;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.logout = logout;
//# sourceMappingURL=profile.js.map