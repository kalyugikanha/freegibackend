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
exports.remove = exports.changeStatus = exports.view = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 100;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Tax.find({
        // storeId:req.body?.storeId
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    result.tax = yield _validation_1.Tax.find({
        $and: [filter],
        // storeId:req.body?.storeId
    })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let categoryRecord = result.tax.length;
    result.lastPage = categoryRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    // let tax: any = await Tax.findOne({ name: req.body.name,  });
    // if (tax)
    //   return res.status(400).json({ error: { name: "Name is already exists." } });
    let newTax = new _validation_1.Tax(lodash_1.default.pick(req.body, ["name", "percentage", "description", "storeId"]));
    newTax = yield newTax.save();
    res.status(200).json({ message: "Tax added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let taxName = yield _validation_1.Tax.findOne({
        name: req.body.name,
        _id: { $ne: req.body.id },
    });
    if (taxName)
        return res.status(400).json({ error: { name: "Name is already exists." } });
    let tax = yield _validation_1.Tax.findOne({ _id: req.body.id });
    if (!tax)
        return res.status(400).json({ message: "No record found." });
    if (req.body.name)
        tax.name = req.body.name;
    if (req.body.percentage)
        tax.percentage = req.body.percentage;
    if (req.body.description)
        tax.description = req.body.description;
    tax = yield tax.save();
    res.status(200).json({ message: "Tax updated successfully." });
});
exports.update = update;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let tax = yield _validation_1.Tax.findOne({
        _id: req.body.id,
        storeId: (_a = req.body) === null || _a === void 0 ? void 0 : _a.storeId
    });
    if (!tax)
        return res.status(404).json({ message: "No record found." });
    res.status(200).json({
        data: tax,
    });
});
exports.view = view;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateStatus)(req.body);
    if (error)
        throw error;
    let tax = yield _validation_1.Tax.findOne({ _id: req.body.id });
    if (!tax)
        return res.status(400).json({ message: "No record found." });
    tax.status = req.body.status;
    tax = yield tax.save();
    res.status(200).json({ message: "Status changed successfully." });
});
exports.changeStatus = changeStatus;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
    // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });
    yield _validation_1.Tax.deleteOne({ _id: req.body.id });
    res.status(200).json({ message: "Tax deleted successfully." });
});
exports.remove = remove;
//# sourceMappingURL=tax.js.map