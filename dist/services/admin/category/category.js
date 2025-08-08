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
exports.uploadImage = exports.remove = exports.changeStatus = exports.view = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const upload_1 = require("../../../helper/upload");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 100;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Category.find({
            storeId: (_a = req.body) === null || _a === void 0 ? void 0 : _a.storeId
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    result.category = yield _validation_1.Category.find({
        $and: [filter],
        storeId: (_b = req.body) === null || _b === void 0 ? void 0 : _b.storeId
    })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    for (let category of result.category) {
        const productCount = yield _validation_1.Product.countDocuments({ category: category._id, storeId: (_c = req.body) === null || _c === void 0 ? void 0 : _c.storeId });
        category.productCount = productCount || 0;
    }
    let categoryRecord = result.category.length;
    result.lastPage = categoryRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let category = yield _validation_1.Category.findOne({ name: req.body.name, storeId: req.body.storeId });
    if (category)
        return res.status(400).json({ error: { name: "Name is already exists." } });
    let newCategory = new _validation_1.Category(lodash_1.default.pick(req.body, ["name", "image", "icon", "color", 'storeId']));
    newCategory = yield newCategory.save();
    res.status(200).json({ message: "Category added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let categoryName = yield _validation_1.Category.findOne({
        name: req.body.name,
        _id: { $ne: req.body.id },
        storeId: req.body.storeId,
    });
    if (categoryName)
        return res.status(400).json({ error: { name: "Name is already exists." } });
    let category = yield _validation_1.Category.findOne({ _id: req.body.id, storeId: req.body.storeId });
    if (!category)
        return res.status(400).json({ message: "No record found." });
    category.name = req.body.name;
    if (req.body.image)
        category.image = req.body.image;
    if (req.body.icon)
        category.icon = req.body.icon;
    if (req.body.color)
        category.color = req.body.color;
    if (req.body.status && req.body.status !== "")
        category.status = req.body.status;
    category = yield category.save();
    res.status(200).json({ message: "Category updated successfully." });
});
exports.update = update;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let category = yield _validation_1.Category.findOne({
        _id: req.body.id,
        storeId: req.body.storeId,
    });
    if (!category)
        return res.status(404).json({ message: "No record found." });
    res.status(200).json({
        data: category,
    });
});
exports.view = view;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateStatus)(req.body);
    if (error)
        throw error;
    let category = yield _validation_1.Category.findOne({ _id: req.body.id, storeId: req.body.storeId });
    if (!category)
        return res.status(400).json({ message: "No record found." });
    category.status = req.body.status;
    category = yield category.save();
    res.status(200).json({ message: "Status changed successfully." });
});
exports.changeStatus = changeStatus;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
    // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });
    yield _validation_1.Category.deleteOne({ _id: req.body.id, storeId: req.body.storeId });
    res.status(200).json({ message: "Category deleted successfully." });
});
exports.remove = remove;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, upload_1.fileUpload)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(400).json({ message: err.message });
        if (!req.body.filename)
            return res.status(400).json({ message: "Please select the file." });
        res.status(200).json({
            message: "File uploaded successfully.",
            data: {
                filename: req.body.filename,
            },
        });
    }));
});
exports.uploadImage = uploadImage;
// export const deleteImage = async (req: Request, res: Response) => {
//     if (!req.body.filename || req.body.filename === '') return res.status(400).json({ message: "File is not selected." });
//     await fileDelete(req.body.filename);
//     res.status(200).json({ message: "File deleted successfully." });
// };
//# sourceMappingURL=category.js.map