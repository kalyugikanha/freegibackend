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
exports.remove = exports.view = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
// import { fileUpload } from "../../../helper/upload";
const encription_1 = require("../../../helper/encription");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 100;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Users.find({
            storeId: req.body.storeId,
            role: "Customer"
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    // let filter: any = new Object();
    let filter = { role: "Customer" }; // Include filter for customers
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    result.users = yield _validation_1.Users.find({
        $and: [filter],
        storeId: req.body.storeId
    })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let usersRecord = result.users.length;
    result.lastPage = usersRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let users = yield _validation_1.Users.findOne({ email: req.body.email, storeId: req.body.storeId });
    if (users)
        return res.status(400).json({ message: "Email is already exists." });
    let newUser = new _validation_1.Users(lodash_1.default.pick(req.body, ["firstName", "lastName", "email", 'storeId']));
    newUser.password = (0, encription_1.encrypt)(req.body.password);
    newUser.role = "Customer";
    newUser = yield newUser.save();
    res.status(200).json({ message: "User added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    if (req.body.email) {
        let usersEmail = yield _validation_1.Users.findOne({
            email: req.body.email,
            _id: { $ne: req.body.id },
            storeId: req.body.storeId
        });
        if (usersEmail)
            return res.status(400).json({ message: "Email is already exists." });
    }
    let user = yield _validation_1.Users.findOne({ _id: req.body.id, storeId: req.body.storeId });
    if (!user)
        return res.status(400).json({ message: "No record found." });
    if (req.body.email)
        user.email = req.body.email;
    if (req.body.firstName)
        user.firstName = req.body.firstName;
    if (req.body.lastName)
        user.lastName = req.body.lastName;
    user = yield user.save();
    res.status(200).json({ message: "User updated successfully." });
});
exports.update = update;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let user = yield _validation_1.Users.findOne({
        _id: req.body.id,
        storeId: req.body.storeId
    });
    if (!user)
        return res.status(404).json({ message: "No record found." });
    res.status(200).json({
        data: user,
    });
});
exports.view = view;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
    // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });
    yield _validation_1.Users.deleteOne({ _id: req.body.id, storeId: req.body.storeId });
    res.status(200).json({ message: "User deleted successfully." });
});
exports.remove = remove;
//# sourceMappingURL=customer.js.map