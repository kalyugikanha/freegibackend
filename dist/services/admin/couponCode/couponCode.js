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
        let totalRecords = yield _validation_1.CouponCode.find({ storeId: req.body.storeId }).countDocuments();
        result.totalRecords = totalRecords;
    }
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    result.couponCode = yield _validation_1.CouponCode.find({
        $and: [filter],
        storeId: req.body.storeId
    })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let categoryRecord = result.couponCode.length;
    result.lastPage = categoryRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let couponCode = yield _validation_1.CouponCode.findOne({ name: req.body.name, storeId: req.body.storeId });
    if (couponCode)
        return res.status(400).json({ error: { name: "Name is already exists." } });
    const schemaKeys = [
        "name",
        "code",
        "type",
        "minPrice",
        "maxPrice",
        "endDate",
        "limit",
        "discount",
        "status",
        "createdAt",
        "updatedAt",
        "storeId"
    ];
    let newCouponCode = new _validation_1.CouponCode(lodash_1.default.pick(req.body, schemaKeys));
    newCouponCode = yield newCouponCode.save();
    res.status(200).json({ message: "Coupon code added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    const { id, name, code, type, minPrice, maxPrice, endDate, limit, discount, status } = req.body;
    // Check if name already exists with a different ID
    const existingCoupon = yield _validation_1.CouponCode.findOne({ name, _id: { $ne: id }, storeId: req.body.storeId });
    if (existingCoupon) {
        return res.status(400).json({ error: { name: "Name already exists." } });
    }
    let couponCode = yield _validation_1.CouponCode.findOne({
        _id: id,
        storeId: req.body.storeId
    });
    if (!couponCode) {
        return res.status(404).json({ message: "No record found." });
    }
    const updatedFields = {};
    if (name)
        updatedFields.name = name;
    if (code)
        updatedFields.code = code;
    if (type)
        updatedFields.type = type;
    if (minPrice !== undefined)
        updatedFields.minPrice = minPrice;
    if (maxPrice !== undefined)
        updatedFields.maxPrice = maxPrice;
    if (endDate)
        updatedFields.endDate = endDate;
    if (limit !== undefined)
        updatedFields.limit = limit;
    if (discount !== undefined)
        updatedFields.discount = discount;
    if (status)
        updatedFields.status = status;
    updatedFields.updatedAt = new Date();
    couponCode = yield _validation_1.CouponCode.findByIdAndUpdate(id, { $set: updatedFields }, { new: true, runValidators: true });
    res.status(200).json({ message: "Coupon code updated successfully.", couponCode });
});
exports.update = update;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let couponCode = yield _validation_1.CouponCode.findOne({
        _id: req.body.id,
        storeId: req.body.storeId
    });
    if (!couponCode)
        return res.status(404).json({ message: "No record found." });
    res.status(200).json({
        data: couponCode,
    });
});
exports.view = view;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateStatus)(req.body);
    if (error)
        throw error;
    let couponCode = yield _validation_1.CouponCode.findOne({ _id: req.body.id, storeId: req.body.storeId });
    if (!couponCode)
        return res.status(400).json({ message: "No record found." });
    couponCode.status = req.body.status;
    couponCode = yield couponCode.save();
    res.status(200).json({ message: "Status changed successfully." });
});
exports.changeStatus = changeStatus;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
    // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });
    yield _validation_1.CouponCode.deleteOne({ _id: req.body.id, storeId: req.body.storeId });
    res.status(200).json({ message: "Coupon code deleted successfully." });
});
exports.remove = remove;
//# sourceMappingURL=couponCode.js.map