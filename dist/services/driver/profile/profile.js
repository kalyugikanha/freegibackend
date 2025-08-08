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
exports.verify = exports.view = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield _validation_1.Users.findOne({ _id: req.body.cid }).select({
        password: 0,
        otp: 0,
    });
    if (!users)
        return res.status(400).json({ message: "No record found." });
    res.status(200).json({ data: users });
});
exports.view = view;
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield _validation_1.Users.findOne({ _id: req.body.id });
    if (!users)
        return res.status(400).json({ message: "No record found." });
    if (users.isVerify)
        return res.status(400).json({ message: "Already verify." });
    yield _validation_1.Users.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.body.id) }, { $set: { isVerify: true } });
    res.status(200).json({ message: "Verify successfully." });
});
exports.verify = verify;
//# sourceMappingURL=profile.js.map