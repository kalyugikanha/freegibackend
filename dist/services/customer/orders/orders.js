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
exports.mostOrder = exports.recentOrderList = exports.orderLocation = exports.exchangeOrder = exports.returnOrder = exports.cancelOrder = exports.update = exports.view = exports.detail = exports.verifyPayment = exports.list = exports.add = exports.Review = exports.Wish = exports.TAX = exports.Address = exports.DealOfTheDay = exports.Product = exports.Option = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const crypto = require("crypto");
const Razorpay = require('razorpay');
const key_secret = "FacIUNRcazCNMXvuosaO86hv";
const razorpayInstance = new Razorpay({
    key_id: "rzp_test_4xd5P3os7w8Pon",
    key_secret: key_secret
});
const mongoose_2 = require("mongoose");
const option_1 = require("../../../models/option");
const product_1 = require("../../../models/product");
const dealoftheday_1 = require("../../../models/dealoftheday");
const address_1 = require("../../../models/address");
const tax_1 = require("../../../models/tax");
const cart_1 = require("../cart/cart");
const wish_1 = require("../../../models/wish");
const reviews_1 = require("../../../models/reviews");
exports.Option = (0, mongoose_2.model)("option", option_1.optionSchema);
exports.Product = (0, mongoose_2.model)("product", product_1.productSchema);
exports.DealOfTheDay = (0, mongoose_2.model)("dealoftheday", dealoftheday_1.dealofthedaySchema);
exports.Address = (0, mongoose_2.model)("address", address_1.addressSchema);
exports.TAX = (0, mongoose_2.model)("tax", tax_1.taxSchema);
exports.Wish = (0, mongoose_2.model)("wish", wish_1.wishSchema);
exports.Review = (0, mongoose_2.model)("reviews", reviews_1.reviewSchema);
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { orderId, products, dealofthedays, totalAmount, discount, deliveryCharge, handlingCharge, couponCode, cartOffer, paymentMethod, tax, deliveryInstruction, address, notes, description, signature, cartId } = req.body;
        let userId = req.body.cid;
        const addressExits = yield exports.Address.findById(address);
        if (!addressExits) {
            return res.status(400).json({ error: "Address does not exist." });
        }
        const taxExits = yield exports.TAX.findById(tax);
        if (!taxExits) {
            return res.status(400).json({ error: "Tax does not exist." });
        }
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "At least one product is required." });
        }
        if (dealofthedays && !Array.isArray(dealofthedays)) {
            return res.status(400).json({ error: "Deal of the day should be an array." });
        }
        for (const product of products) {
            const { productId, optionId } = product;
            const productExists = yield exports.Product.findById(productId);
            if (!productExists) {
                return res.status(400).json({ error: `Product with ID ${productId} does not exist.` });
            }
            const optionExists = yield exports.Option.findById(optionId);
            if (!optionExists) {
                return res.status(400).json({ error: `Option with ID ${optionId} does not exist.` });
            }
            if (optionExists.productId.toString() !== productId) {
                return res.status(400).json({ error: `Option with ID ${optionId} does not belong to Product with ID ${productId}.` });
            }
        }
        if (dealofthedays) {
            for (const deal of dealofthedays) {
                const dealExists = yield exports.DealOfTheDay.findOne({ _id: deal.dealId });
                if (!dealExists) {
                    return res.status(400).json({ error: `Deal with ID ${deal.dealId} does not exist.` });
                }
            }
        }
        if (cartOffer) {
            let cartOfferData;
            if (cartOffer.type === "product") {
                if (!cartOffer.productId || !cartOffer.optionId) {
                    return res.status(400).json({ error: "Product cart cartOffer must have productId and optionId." });
                }
                cartOfferData = yield cart_1.CartOffer.findOne({
                    productId: cartOffer.productId,
                    optionId: cartOffer.optionId,
                });
                if (!cartOfferData) {
                    return res.status(400).json({ error: "Invalid product cart cartOffer." });
                }
                cartOffer = {
                    type: "product",
                    cartOfferId: cartOfferData._id,
                    productId: cartOffer.productId,
                    optionId: cartOffer.optionId,
                };
            }
            else if (cartOffer.type === "freeGift") {
                if (!cartOffer.freeGiftId) {
                    return res.status(400).json({ error: "Free gift cart cartOffer must have freeGiftId." });
                }
                cartOfferData = yield cart_1.CartOffer.findOne({
                    freeGiftId: cartOffer.freeGiftId,
                });
                if (!cartOfferData) {
                    return res.status(400).json({ error: "Invalid free gift cart cartOffer." });
                }
                cartOffer = {
                    type: "freeGift",
                    cartOfferId: cartOfferData._id,
                    freeGiftId: cartOffer.freeGiftId,
                };
            }
        }
        let newOrder = new _validation_1.Orders({
            orderDate: new Date(),
            orderId,
            userId,
            products,
            dealofthedays: dealofthedays || [],
            totalAmount,
            cartOffer: cartOffer,
            discount,
            storeId: req.body.storeId,
            deliveryCharge,
            handlingCharge,
            couponCode: couponCode || null,
            paymentMethod,
            tax,
            paymentStatus: paymentMethod === "razorpay" ? "completed" : "pending",
            status: "pending",
            deliveryInstruction,
            address,
            notes,
            description,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        yield newOrder.save();
        if (paymentMethod === "razorpay") {
            yield _validation_1.Cart.deleteOne({ _id: new mongoose_1.default.Types.ObjectId(cartId), storeId: req.body.storeId });
            return res.status(200).json({ message: "Order added successfully.", data: newOrder });
        }
        const order = yield _validation_1.Orders.findOne({ orderId: orderId, storeId: req.body.storeId });
        yield _validation_1.Orders.findByIdAndUpdate({ _id: order === null || order === void 0 ? void 0 : order._id }, {
            $set: {
                status: "pending",
                paymentStatus: paymentMethod !== "cash" ? "completed" : "pending",
                paymentMethod: paymentMethod,
            },
        });
        if (paymentMethod === "wallet") {
            let newWallet = new _validation_1.wallet();
            newWallet.userId = order.userId;
            newWallet.amount = -order.totalAmount;
            newWallet.status = "completed";
            newWallet.isWallet = false;
            newWallet.orderId = order._id;
            newWallet.createdAt = new Date().toISOString();
            newWallet.updatedAt = new Date().toISOString();
            newWallet = yield newWallet.save();
            yield _validation_1.Users.findByIdAndUpdate({ _id: order.userId }, { $inc: { amount: -order.totalAmount } });
        }
        let newPayment = new _validation_1.Payments();
        newPayment.userId = order.userId;
        newPayment.orderId = order._id;
        newPayment.amount = order.totalAmount;
        newPayment.paymentMethod = paymentMethod;
        if (paymentMethod !== "cash")
            newPayment.status = "completed";
        newPayment.paymentGateway = paymentMethod === "razorpay" ? paymentMethod : "";
        newPayment.paymentDate = new Date().toISOString();
        newPayment.signature = paymentMethod === "razorpay" ? signature : "";
        newPayment.description = order.description;
        newPayment.storeId = req.body.storeId;
        newPayment.createdAt = new Date().toISOString();
        newPayment.updatedAt = new Date().toISOString();
        newPayment = yield newPayment.save();
        yield _validation_1.Cart.deleteOne({ _id: new mongoose_1.default.Types.ObjectId(cartId), storeId: req.body.storeId });
        res.status(200).json({ message: "Order added successfully.", data: newOrder });
    }
    catch (error) {
        console.error("Order Creation Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Something went wrong." });
        }
    }
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield _validation_1.Orders.find({ userId: req.body.cid, storeId: req.body.storeId })
            .populate({
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
            .populate({
            path: "userId",
            select: "-password -otp -amount -createdAt -updatedAt",
            match: { role: "Customer" } // Sirf customer role wale users laana
        })
            .populate({
            path: "deliveryAgent",
            select: "-password -otp -amount -createdAt -updatedAt -authCode",
            match: { role: "DeliveryAgent" } // Sirf customer role wale users laana
        })
            .populate("couponCode", { name: 1, code: 1, discount: 1 })
            .populate("tax", { name: 1, percentage: 1, description: 1 })
            .sort({ _id: -1 })
            .lean();
        const updatedOrders = yield Promise.all(orders.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            let dealOfTheDayData = [];
            if (order.dealofthedays && order.dealofthedays.length > 0) {
                for (let dealItem of order.dealofthedays) {
                    // Fetch the deal based on dealId
                    const deal = yield exports.DealOfTheDay.findById({ _id: dealItem.dealId, storeId: req.body.storeId })
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
        res.status(200).json({
            data: updatedOrders,
        });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(200).json({ message: "Internal Server Error" });
    }
});
exports.list = list;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, paymentId, signature, paymentMethod, cartId } = req.body;
    const keySecret = key_secret;
    const generateSignature = paymentMethod == "razorpay" ? crypto.createHmac("sha256", keySecret).update(orderId + "|" + paymentId).digest("hex") : "";
    if (generateSignature == signature) {
        const detail = paymentMethod == "razorpay" ? yield razorpayInstance.payments.fetch(paymentId) : "";
        const order = yield _validation_1.Orders.findOne({ orderId: orderId });
        yield _validation_1.Orders.findByIdAndUpdate({ _id: order === null || order === void 0 ? void 0 : order._id }, { $set: { status: "pending", paymentStatus: paymentMethod != 'cash' ? "completed" : "pending", paymentMethod: paymentMethod } });
        if (paymentMethod == 'wallet') {
            let newWallet = new _validation_1.wallet();
            newWallet.userId = order.userId;
            newWallet.amount = -order.totalAmount;
            newWallet.status = "completed";
            newWallet.isWallet = false;
            newWallet.orderId = order._id;
            newWallet.createdAt = new Date().toISOString();
            newWallet.updatedAt = new Date().toISOString();
            newWallet = yield newWallet.save();
            yield _validation_1.Users.findByIdAndUpdate({ _id: order.userId }, { $inc: { amount: -order.totalAmount } });
        }
        let newPayment = new _validation_1.Payments();
        newPayment.userId = order.userId;
        newPayment.orderId = order._id;
        newPayment.amount = order.totalAmount;
        newPayment.paymentMethod = paymentMethod;
        newPayment.paymentId = paymentMethod == "razorpay" ? paymentId : "PY_" + (0, _validation_1.generateAutoID)(12);
        newPayment.transactionId = paymentMethod == "razorpay" ? detail.acquirer_data.upi_transaction_id : "TD_" + (0, _validation_1.generateAutoID)(12);
        if (paymentMethod != 'cash')
            newPayment.status = "completed";
        newPayment.paymentGateway = paymentMethod == "razorpay" ? paymentMethod : "";
        newPayment.paymentDate = new Date().toISOString();
        newPayment.signature = paymentMethod == "razorpay" ? signature : "";
        newPayment.description = order.description;
        newPayment.createdAt = new Date().toISOString();
        newPayment.updatedAt = new Date().toISOString();
        newPayment = yield newPayment.save();
        yield _validation_1.Cart.deleteOne({ _id: new mongoose_1.default.Types.ObjectId(cartId) });
        res.status(200).json({ message: "Payment verified" });
    }
    else {
        res.status(400).json({ message: "Invaild signature" });
    }
});
exports.verifyPayment = verifyPayment;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.body;
    let userId = req.body.cid;
    const order = yield _validation_1.Orders.findOne({ _id: orderId, userId, storeId: req.body.storeId })
        .populate({
        path: "address",
    })
        .populate({
        path: "products.productId",
        model: "product",
    })
        .populate({
        path: "products.optionId",
        model: "option",
    }).populate({
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
    }).populate("userId", {
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
    }).populate("couponCode", { name: 1, code: 1, discount: 1 })
        .populate("tax", { name: 1, percentage: 1, description: 1 })
        .sort({ _id: -1 })
        .lean();
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    let dealOfTheDayData = [];
    if (order.dealofthedays && order.dealofthedays.length > 0) {
        for (let dealItem of order.dealofthedays) {
            const deal = yield exports.DealOfTheDay.findOne({ _id: dealItem.dealId, storeId: req.body.storeId })
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
    res.status(200).json({ message: "Order detail successfully.", data: order });
});
exports.detail = detail;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let order = yield _validation_1.Orders.findOne({
        _id: req.body.id,
        userId: req.body.cid,
        storeId: req.body.storeId
    }).populate("products.productId");
    if (!order)
        return res.status(400).json({ message: "No record found." });
    res.status(200).json({ data: order });
});
exports.view = view;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let orders = yield _validation_1.Orders.findOne({ _id: req.body.id, storeId: req.body.storeId });
    if (!orders)
        return res.status(400).json({ message: "No record found." });
    if (req.body.products)
        orders.products = req.body.products;
    if (req.body.address)
        orders.address = req.body.address;
    if (req.body.totalAmount)
        orders.totalAmount = req.body.totalAmount;
    if (req.body.discount)
        orders.discount = req.body.discount;
    if (req.body.deliveryCharge)
        orders.deliveryCharge = req.body.deliveryCharge;
    if (req.body.handlingCharge)
        orders.handlingCharge = req.body.handlingCharge;
    if (req.body.couponCode)
        orders.couponCode = req.body.couponCode;
    if (req.body.paymentMethod)
        orders.paymentMethod = req.body.paymentMethod;
    if (req.body.deliveryInstruction)
        orders.deliveryInstruction = req.body.deliveryInstruction;
    if (req.body.notes)
        orders.notes = req.body.notes;
    if (req.body.tax)
        orders.tax = req.body.tax;
    orders = yield orders.save();
    res.status(200).json({ message: "Order updated successfully." });
});
exports.update = update;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, reason, description } = req.body;
    const fileds = {
        status: "cancelled",
    };
    if (reason) {
        fileds["reason"] = reason;
    }
    else {
        fileds["description"] = description;
    }
    yield _validation_1.Orders.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(id), storeId: req.body.storeId }, { $set: fileds });
    res.status(200).json({ message: "Order cancel successfully." });
});
exports.cancelOrder = cancelOrder;
const returnOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, reason, description, image } = req.body;
    const fileds = {
        status: "returned",
        image: image
    };
    if (reason) {
        fileds["reason"] = reason;
    }
    else {
        fileds["description"] = description;
    }
    yield _validation_1.Orders.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(id) }, { $set: fileds });
    res.status(200).json({ message: "Order return successfully." });
});
exports.returnOrder = returnOrder;
const exchangeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, reason, description, image } = req.body;
    const fileds = {
        status: "exchanged",
        image: image
    };
    if (reason) {
        fileds["reason"] = reason;
    }
    else {
        fileds["description"] = description;
    }
    yield _validation_1.Orders.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(id) }, { $set: fileds });
    res.status(200).json({ message: "Order exchange successfully." });
});
exports.exchangeOrder = exchangeOrder;
const orderLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateOrderLocation)(req.body);
    if (error)
        throw error;
    let driverDetail = yield _validation_1.DriverGeoLocation.aggregate([{
            $match: {
                orderId: new mongoose_1.default.Types.ObjectId(req.body.orderId)
            }
        },
        {
            $lookup: {
                from: "users",
                let: { id: "$driver" },
                pipeline: [{
                        $match: {
                            $expr: { $eq: ["$_id", "$$id"] }
                        }
                    }],
                as: "driverDetail"
            }
        },
        {
            $unwind: "$driverDetail"
        },
        {
            $lookup: {
                from: "users",
                let: { id: "$driver" },
                pipeline: [{
                        $match: {
                            $expr: { $eq: ["$_id", "$$id"] }
                        }
                    }],
                as: "driverDetail"
            }
        },
        {
            $unwind: "$driverDetail"
        },
        {
            $lookup: {
                from: "address",
                let: { id: new mongoose_1.default.Types.ObjectId(req.body.addressId) },
                pipeline: [{
                        $match: {
                            $expr: { $eq: ["$_id", "$$id"] }
                        }
                    }],
                as: "addressDetail"
            }
        },
        {
            $unwind: "$addressDetail"
        }]);
    if (driverDetail.length > 0) {
        res.status(200).json({ message: "Geo Location get successfully.", data: driverDetail[0] });
    }
    else {
        res.status(400).json({ message: "No record found." });
    }
});
exports.orderLocation = orderLocation;
const recentOrderList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield _validation_1.Orders.find({ userId: req.body.cid, storeId: req.body.storeId })
        .populate({
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
        .populate("couponCode", { name: 1, code: 1, discount: 1 })
        .populate("tax", { name: 1, percentage: 1, description: 1 })
        .sort({ _id: -1 })
        .limit(4)
        .lean();
    res.status(200).json({ data: orders });
});
exports.recentOrderList = recentOrderList;
const mostOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.cid;
    try {
        const list = yield _validation_1.Orders.aggregate([
            // {
            //   $match: {
            //     // status: "delivered",
            //     // userId: new mongoose.Types.ObjectId(req.body.cid),
            //     // storeId:req.body.storeId
            //   },
            // },
            {
                $unwind: "$products",
            },
            {
                $group: {
                    _id: {
                        productId: "$products.productId",
                        optionId: "$products.optionId",
                    },
                    count: { $sum: 1 }, // Count how many times this option appears
                },
            },
            {
                $group: {
                    _id: "$_id.productId",
                    options: {
                        $push: {
                            optionId: "$_id.optionId",
                            count: "$count", // Include the count of each option
                        },
                    },
                    hasDuplicateOptions: {
                        $max: {
                            $cond: [{ $gt: ["$count", 1] }, true, false], // Check if any option appears more than once
                        },
                    },
                },
            },
            {
                $match: {
                    hasDuplicateOptions: true, // Only include products with at least one duplicate option
                },
            },
            {
                $lookup: {
                    from: "product",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$id"] },
                            },
                        },
                        {
                            $lookup: {
                                from: "reviews",
                                let: { id: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$productId", "$$id"] },
                                        },
                                    },
                                ],
                                as: "reviews",
                            },
                        },
                        {
                            $lookup: {
                                from: "wish",
                                let: { id: new mongoose_1.default.Types.ObjectId(userId) },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$userId", "$$id"] },
                                        },
                                    },
                                ],
                                as: "wishDetail",
                            },
                        },
                        {
                            $unwind: {
                                path: "$wishDetail",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $addFields: {
                                isWish: {
                                    $in: ["$_id", { $ifNull: ["$wishDetail.productId", []] }],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                image: 1,
                                status: 1,
                                description: 1,
                                price: 1,
                                stock: 1,
                                imageList: 1,
                                isWish: 1,
                                rating: {
                                    $round: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        { $sum: "$reviews.rating" },
                                                        {
                                                            $multiply: [
                                                                5,
                                                                {
                                                                    $cond: {
                                                                        if: { $eq: [{ $size: "$reviews" }, 0] },
                                                                        then: 1,
                                                                        else: { $size: "$reviews" },
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                5,
                                            ],
                                        },
                                        1,
                                    ],
                                },
                            },
                        },
                    ],
                    as: "productDetail",
                },
            },
            {
                $unwind: "$productDetail",
            },
            {
                $lookup: {
                    from: "option",
                    let: { optionIds: "$options.optionId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$_id", "$$optionIds"] },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                optionId: "$_id",
                                title: 1,
                                mass: 1,
                                stock: 1,
                                price: 1,
                            },
                        },
                    ],
                    as: "optionDetails",
                },
            },
        ]);
        const cartData = yield _validation_1.Cart.findOne({ userId: req.body.cid }).populate({
            path: "products.optionId",
            model: "option",
        });
        const uniqueProducts = new Set();
        const productsWithOptionCount = list
            .filter((item) => {
            if (!uniqueProducts.has(item._id.toString())) {
                uniqueProducts.add(item._id.toString());
                return true;
            }
            return false;
        })
            .map((item) => {
            const product = item.productDetail;
            // Map options with their details
            product.options = item.options
                .map((opt) => {
                const option = item.optionDetails.find((o) => o.optionId.toString() === opt.optionId.toString());
                if (option) {
                    // Find the cart quantity for this option
                    const cartOption = cartData === null || cartData === void 0 ? void 0 : cartData.products.find((cartItem) => cartItem.productId.toString() === product._id.toString() &&
                        cartItem.optionId._id.toString() === option.optionId.toString());
                    return {
                        optionId: option.optionId,
                        count: opt.count,
                        title: option.title,
                        mass: option.mass,
                        stock: option.stock,
                        price: option.price,
                        cartOptionQty: cartOption ? cartOption.quantity : 0, // Add cart quantity for the option
                    };
                }
                return null;
            })
                .filter(Boolean);
            // Calculate total stock for the product
            product.stock = product.options.reduce((sum, option) => sum + option.stock, 0);
            // Calculate total cart quantity for the product by summing up the cart quantities of all its options
            product.cartQuantity = product.options.reduce((sum, option) => sum + option.cartOptionQty, 0);
            return product;
        });
        console.log(productsWithOptionCount);
        res.status(200).json({ data: productsWithOptionCount });
        //     const orders = await Orders.find({ userId, status: "pending" })
        //   .populate("address")
        //   .populate({
        //     path: "products.productId",
        //     model: "product"
        //   })
        //   .populate({
        //     path: "products.optionId",
        //     model: "option",
        //   })
        //   .populate({
        //     path: "dealofthedays.dealId",
        //     model: "dealoftheday",
        //     strictPopulate: false,
        //   })
        //   .populate("userId", {
        //     password: 0,
        //     otp: 0,
        //     role: 0,
        //     amount: 0,
        //     createdAt: 0,
        //     updatedAt: 0,
        //   })
        //   .populate("couponCode", { name: 1, code: 1, discount: 1 })
        //   .populate("tax", { name: 1, percentage: 1, description: 1 })
        //   .sort({ _id: -1 })
        //   .lean();
        // const optionIdCountMap = new Map();
        // orders.forEach(order => {
        //   order.products.forEach(product => {
        //     if (product.optionId) {
        //       const optionIdStr = product.optionId.toString();
        //       optionIdCountMap.set(optionIdStr, (optionIdCountMap.get(optionIdStr) || 0) + 1);
        //     }
        //   });
        // });
        // const duplicateProductsMap = new Map();
        // orders.forEach(order => {
        //   order.products.forEach(product => {
        //     if (product.optionId) {
        //       const optionIdStr = product.optionId.toString();
        //       if (optionIdCountMap.get(optionIdStr) > 1) {
        //         if (!duplicateProductsMap.has(optionIdStr)) {
        //           product.quantity = optionIdCountMap.get(optionIdStr);
        //           duplicateProductsMap.set(optionIdStr, product); 
        //         }
        //       }
        //     }
        //   });
        // });
        // let filteredProducts = await Promise.all(
        //   Array.from(duplicateProductsMap.values()).map(async (product:any) => {
        //     if (!product.productId) return product;
        //     const productId = product.productId._id;
        //     const isWish = await Wish.exists({ userId: req.body.cid, productId });
        //     const reviewData = await Review.aggregate([
        //       { $match: { productId, userId: req.body.cid } },
        //     ]);
        //     const rating = reviewData.length > 0 ? reviewData[0].rating : 0;
        //     return {
        //       ...product,
        //       isWish: isWish ? true : false,
        //       rating: rating,
        //     };
        //   })
        // );
        res.status(200).json({ data: productsWithOptionCount });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(400).json({ message: "An error occurred while fetching the data." });
    }
});
exports.mostOrder = mostOrder;
//# sourceMappingURL=orders.js.map