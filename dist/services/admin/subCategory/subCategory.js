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
exports.remove = exports.view = exports.changeStatus = exports.update = exports.add = exports.categoryViseList = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 100;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.SubCategory.find({
            storeId: (_a = req.body) === null || _a === void 0 ? void 0 : _a.storeId
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    result.subCategory = yield _validation_1.SubCategory.find({
        $and: [filter],
        storeId: (_b = req.body) === null || _b === void 0 ? void 0 : _b.storeId
    })
        .populate("category", { name: 1, image: 1, color: 1, icon: 1 })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    for (let subCategory of result.subCategory) {
        const productCount = yield _validation_1.Product.countDocuments({ subCategory: subCategory._id, storeId: (_c = req.body) === null || _c === void 0 ? void 0 : _c.storeId });
        subCategory.productCount = productCount || 0;
    }
    let subCategoryRecord = result.subCategory.length;
    result.lastPage = subCategoryRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const categoryViseList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const subCategory = yield _validation_1.SubCategory.find({
        category: req.body.category,
        storeId: (_d = req.body) === null || _d === void 0 ? void 0 : _d.storeId
    })
        .populate("category", { name: 1, image: 1, color: 1, icon: 1 })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: subCategory });
});
exports.categoryViseList = categoryViseList;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let category = yield _validation_1.SubCategory.findOne({ name: req.body.name, storeId: (_e = req.body) === null || _e === void 0 ? void 0 : _e.storeId });
    if (category)
        return res.status(400).json({ error: { name: "Name is already exists." } });
    let newCategory = new _validation_1.SubCategory(lodash_1.default.pick(req.body, ["name", "category", "icon", "storeId"]));
    newCategory = yield newCategory.save();
    res.status(200).json({ message: "Sub Category added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let subCategoryName = yield _validation_1.SubCategory.findOne({
        name: req.body.name,
        _id: { $ne: req.body.id },
        storeId: (_f = req.body) === null || _f === void 0 ? void 0 : _f.storeId
    });
    if (subCategoryName)
        return res.status(400).json({ error: { name: "Name is already exists." } });
    let category = yield _validation_1.SubCategory.findOne({ _id: req.body.id, storeId: (_g = req.body) === null || _g === void 0 ? void 0 : _g.storeId });
    if (!category)
        return res.status(400).json({ message: "No record found." });
    category.name = req.body.name;
    if (req.body.category)
        category.category = req.body.category;
    if (req.body.icon)
        category.icon = req.body.icon;
    if (req.body.status && req.body.status !== "")
        category.status = req.body.status;
    category = yield category.save();
    res.status(200).json({ message: "Sub Category updated successfully." });
});
exports.update = update;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const { error } = (0, _validation_1.validateStatus)(req.body);
    if (error)
        throw error;
    let category = yield _validation_1.SubCategory.findOne({ _id: req.body.id, storeId: (_h = req.body) === null || _h === void 0 ? void 0 : _h.storeId });
    if (!category)
        return res.status(400).json({ message: "No record found." });
    category.status = req.body.status;
    category = yield category.save();
    res.status(200).json({ message: "Status changed successfully." });
});
exports.changeStatus = changeStatus;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let category = yield _validation_1.SubCategory.findOne({
        _id: req.body.id,
        storeId: (_j = req.body) === null || _j === void 0 ? void 0 : _j.storeId
    }).populate("category", { name: 1, image: 1, color: 1, icon: 1 });
    if (!category)
        return res.status(404).json({ message: "No record found." });
    res.status(200).json({
        data: category,
    });
});
exports.view = view;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
    // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });
    yield _validation_1.SubCategory.deleteOne({ _id: req.body.id, storeId: (_k = req.body) === null || _k === void 0 ? void 0 : _k.storeId });
    res.status(200).json({ message: "Category deleted successfully." });
});
exports.remove = remove;
//# sourceMappingURL=subCategory.js.map