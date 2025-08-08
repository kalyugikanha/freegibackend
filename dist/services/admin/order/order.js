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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.list = void 0;
const _validation_1 = require("./_validation");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 100;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Order.find({
            storeId: req.body.storeId
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    result.order = yield _validation_1.Order.find({
        $and: [filter],
        storeId: req.body.storeId
    })
        .populate("products.productId", {
        name: 1,
        price: 1,
        image: 1,
        description: 1,
    })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let categoryRecord = result.order.length;
    result.lastPage = categoryRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let check = yield _validation_1.Order.findOne({ _id: req.body.orderId, storeId: req.body.storeId });
    if (!check)
        return res.status(404).json({ message: "No record found." });
    yield _validation_1.Order.updateOne({ _id: req.body.orderId }, { $set: { status: req.body.status, notes: req.body.notes } });
    let orderData = yield _validation_1.Order.findOne({ _id: req.body.orderId, storeId: req.body.storeId });
    res.status(200).json({ message: "Order status updated successfully", data: orderData });
});
exports.updateStatus = updateStatus;
//# sourceMappingURL=order.js.map