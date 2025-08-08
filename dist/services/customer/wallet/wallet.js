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
exports.list = exports.verifyPayment = exports.add = exports.amountDetail = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const crypto = require("crypto");
const Razorpay = require('razorpay');
const key_secret = "FacIUNRcazCNMXvuosaO86hv";
const razorpayInstance = new Razorpay({
    key_id: "rzp_test_4xd5P3os7w8Pon",
    key_secret: key_secret
});
const amountDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error } = (0, _validation_1.validate)(req.body);
    if (error)
        throw error;
    const user = yield _validation_1.Users.findOne({ _id: req.body.userId });
    res.status(200).json({ message: "successfully.", data: (_a = user === null || user === void 0 ? void 0 : user.amount) !== null && _a !== void 0 ? _a : 0 });
});
exports.amountDetail = amountDetail;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let newWallet = new _validation_1.wallet();
    newWallet.userId = req.body.userId;
    newWallet.amount = req.body.amount;
    newWallet.status = "pending";
    newWallet.orderId = req.body.orderId;
    newWallet.createdAt = new Date().toISOString();
    newWallet.updatedAt = new Date().toISOString();
    newWallet = yield newWallet.save();
    res.status(200).json({ message: "Added successfully." });
});
exports.add = add;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, paymentId, signature } = req.body;
    const keySecret = key_secret;
    const order = yield _validation_1.wallet.findOne({ orderId: orderId });
    const generateSignature = crypto.createHmac("sha256", keySecret).update(orderId + "|" + paymentId).digest("hex");
    if (generateSignature == signature) {
        const detail = yield razorpayInstance.payments.fetch(paymentId);
        yield _validation_1.wallet.findByIdAndUpdate({ _id: order._id }, { $set: { status: "completed", signature: signature, paymentId: paymentId, transactionId: detail.acquirer_data.upi_transaction_id, paymentDate: new Date().toISOString() } });
        yield _validation_1.Users.findByIdAndUpdate({ _id: order.userId }, { $inc: { amount: order.amount } });
        res.status(200).json({ message: "Payment verified" });
    }
    else {
        yield _validation_1.wallet.findByIdAndUpdate({ _id: order._id }, { $set: { status: "failed", paymentDate: new Date().toISOString() } });
        res.status(400).json({ message: "Invaild signature" });
    }
});
exports.verifyPayment = verifyPayment;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield _validation_1.wallet.find({ userId: new mongoose_1.default.Types.ObjectId(req.body.cid) }).sort({ createdAt: -1 }).exec();
    res.status(200).json({ data: list });
});
exports.list = list;
//# sourceMappingURL=wallet.js.map