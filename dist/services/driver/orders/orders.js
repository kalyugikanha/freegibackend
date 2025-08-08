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
exports.updateStatus = exports.cashPaymentOrder = exports.cancelOrder = exports.OrderHistory = exports.list = exports.activeOrder = exports.OrderCountApi = exports.Address = exports.DealOfTheDay = exports.Product = exports.Option = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const option_1 = require("../../../models/option");
const product_1 = require("../../../models/product");
const dealoftheday_1 = require("../../../models/dealoftheday");
const address_1 = require("../../../models/address");
const _validation_2 = require("../../admin/totalCount/_validation");
exports.Option = (0, mongoose_2.model)("option", option_1.optionSchema);
exports.Product = (0, mongoose_2.model)("product", product_1.productSchema);
exports.DealOfTheDay = (0, mongoose_2.model)("dealoftheday", dealoftheday_1.dealofthedaySchema);
exports.Address = (0, mongoose_2.model)("address", address_1.addressSchema);
const OrderCountApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the current date and time
    const now = new Date();
    // Define the start of today, this week, and this month
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Query for orders assigned to the delivery agent
    const todayOrdersCount = yield _validation_1.Orders.find({
        deliveryAgent: req.body.cid,
        createdAt: { $gte: startOfToday },
    }).countDocuments();
    const weeklyOrdersCount = yield _validation_1.Orders.find({
        deliveryAgent: req.body.cid,
        createdAt: { $gte: startOfWeek },
    }).countDocuments();
    const monthlyOrdersCount = yield _validation_1.Orders.find({
        deliveryAgent: req.body.cid,
        createdAt: { $gte: startOfMonth },
    }).countDocuments();
    // Return the counts in a single response
    res.status(200).json({
        today: todayOrdersCount || 0,
        weekly: weeklyOrdersCount || 0,
        monthly: monthlyOrdersCount || 0,
    });
});
exports.OrderCountApi = OrderCountApi;
const activeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { agentId } = req.params;
    // Define active order statuses
    const activeStatuses = ["pending", "confirmed", "shipped"];
    // Query for active orders assigned to the delivery agent
    const activeOrdersCount = yield _validation_1.Orders.countDocuments({
        deliveryAgent: req.body.cid,
        status: { $in: activeStatuses },
    });
    // Return the active order count
    res.status(200).json({ activeOrders: activeOrdersCount || 0 });
});
exports.activeOrder = activeOrder;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield _validation_1.Orders.find({
        $or: [
            { deliveryAgent: req.body.cid },
            { deliveryAgent: null }
        ],
        status: {
            '$not': {
                '$in': ["pending", "delivered", "cancelled", 'Reject']
            }
        }
    }).populate({
        path: "address",
    })
        .populate({
        path: "products.productId",
        model: "product",
    })
        .populate({
        path: "products.optionId",
        model: "option",
    })
        .populate({
        path: "cartOffer.productId",
        model: "product",
        strictPopulate: false,
    }).populate({
        path: "cartOffer.optionId",
        model: "option",
        strictPopulate: false,
    })
        .populate({
        path: "cartOffer.freeGiftId",
        model: "freeProduct",
    })
        .populate("userId", {
        password: 0,
        otp: 0,
        role: 0,
        amount: 0,
        createdAt: 0,
        updatedAt: 0,
    })
        .populate({
        path: "deliveryAgent",
        select: "-password -otp -amount -createdAt -updatedAt -authCode",
        match: { role: "DeliveryAgent" } // Sirf customer role wale users laana
    })
        .populate("couponCode", { name: 1, code: 1, discount: 1 })
        .populate("address", { tag: 1, address: 1, pincode: 1, lat: 1, long: 1, addressType: 1, default: 1, floor: 1, landMark: 1 })
        .populate("tax", { name: 1, percentage: 1, description: 1 })
        .sort({ _id: -1 })
        .lean();
    console.log("---orders---- " + orders.length);
    const updatedOrders = yield Promise.all(orders.map((order) => __awaiter(void 0, void 0, void 0, function* () {
        let dealOfTheDayData = [];
        if (order.dealofthedays && order.dealofthedays.length > 0) {
            for (let dealItem of order.dealofthedays) {
                // Fetch the deal based on dealId
                const deal = yield exports.DealOfTheDay.findById(dealItem.dealId)
                    .populate({
                    path: "products.productId",
                })
                    .populate({
                    path: "products.optionId",
                })
                    .lean();
                if (deal) {
                    dealOfTheDayData.push({
                        dealId: deal._id,
                        flog: "dealOfDay",
                        name: deal.name,
                        image: deal.image,
                        price: deal.price,
                        description: deal.description,
                        quantity: dealItem.quantity,
                        products: deal.products.map(product => (Object.assign(Object.assign({}, product), { optionDetails: product.optionId }))),
                    });
                }
            }
        }
        order.dealofthedays = dealOfTheDayData;
        return order;
    })));
    res.status(200).json({ data: updatedOrders });
});
exports.list = list;
const OrderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield _validation_1.Orders.find({
        deliveryAgent: req.body.userId,
        status: "delivered",
    })
        .populate("userId", {
        password: 0,
        otp: 0,
        role: 0,
        amount: 0,
        createdAt: 0,
        updatedAt: 0,
    }).populate({
        path: "deliveryAgent",
        select: "-password -otp -amount -createdAt -updatedAt -authCode",
        match: { role: "DeliveryAgent" } // Sirf customer role wale users laana
    })
        .populate("couponCode", { name: 1, code: 1, discount: 1 })
        .populate("products.productId")
        .populate("address", { tag: 1, address: 1, pincode: 1, lat: 1, long: 1, addressType: 1, default: 1, floor: 1, landMark: 1 })
        .populate("tax", { name: 1, percentage: 1, description: 1 })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: orders });
});
exports.OrderHistory = OrderHistory;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileds = {
        status: "cancelled",
    };
    if (req.body.reason) {
        fileds["reason"] = req.body.reason;
    }
    else {
        fileds["description"] = req.body.description;
    }
    yield _validation_1.Orders.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.body._id) }, { $set: fileds });
    res.status(200).json({ message: "Order cancel successfully." });
});
exports.cancelOrder = cancelOrder;
const cashPaymentOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileds = {
        paymentStatus: "completed",
    };
    yield _validation_1.Orders.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.body._id) }, { $set: fileds });
    const paymentfileds = {
        status: "completed",
        paymentDate: new Date().toISOString()
    };
    yield _validation_1.Payments.findOneAndUpdate({ orderId: new mongoose_1.default.Types.ObjectId(req.body._id) }, { $set: paymentfileds });
    res.status(200).json({ message: "Cash Payment successfully." });
});
exports.cashPaymentOrder = cashPaymentOrder;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let check = yield _validation_2.Order.findOne({ _id: req.body.orderId });
    if (!check)
        return res.status(404).json({ message: "No record found." });
    yield _validation_2.Order.updateOne({ _id: req.body.orderId }, { $set: { status: req.body.status, notes: req.body.notes, deliveryAgent: req.body.cid } });
    let orderData = yield _validation_2.Order.findOne({ _id: req.body.orderId });
    res.status(200).json({ message: "Order status updated successfully", data: orderData });
});
exports.updateStatus = updateStatus;
//# sourceMappingURL=orders.js.map