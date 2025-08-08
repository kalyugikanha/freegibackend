"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.couponApply = exports.couponList = exports.reorder = exports.remove = exports.update = exports.recentCartItems = exports.view = exports.add = exports.DealOfTheDay = exports.CouponCode = exports.Product = exports.FreeProduct = exports.CartOffer = exports.Option = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importStar(require("mongoose"));
const option_1 = require("../../../models/option");
const erroHandle_1 = require("../../../helper/erroHandle");
const cartOffer_1 = require("../../../models/cartOffer");
const freeProduct_1 = require("../../../models/freeProduct");
const product_1 = require("../../../models/product");
const couponCode_1 = require("../../../models/couponCode");
const dealoftheday_1 = require("../../../models/dealoftheday");
exports.Option = (0, mongoose_1.model)("option", option_1.optionSchema);
exports.CartOffer = (0, mongoose_1.model)("cartOffer", cartOffer_1.cartOffer);
exports.FreeProduct = (0, mongoose_1.model)("freeProduct", freeProduct_1.freeProductSchema);
exports.Product = (0, mongoose_1.model)("product", product_1.productSchema);
exports.CouponCode = (0, mongoose_1.model)("CouponCode", couponCode_1.couponCodeSchema);
exports.DealOfTheDay = (0, mongoose_1.model)("dealoftheday", dealoftheday_1.dealofthedaySchema);
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let { products, dealOfTheDay } = req.body;
    let cart = yield _validation_1.Cart.findOne({ userId: req.body.cid, storeId: req.body.storeId });
    if (!cart) {
        cart = new _validation_1.Cart({
            userId: req.body.cid,
            products: [],
            dealofthedayId: [],
            amount: 0,
        });
    }
    const initialAmount = cart.amount;
    if (products && products.length > 0) {
        for (let product of products) {
            const i = cart.products.findIndex((p) => p.productId.toString() === product.productId.toString() &&
                p.optionId.toString() === product.optionId.toString());
            if (i !== -1) {
                cart.products[i].quantity += product.quantity;
            }
            else {
                cart.products.push(Object.assign(Object.assign({}, product), { flog: "product" }));
            }
            cart.amount += product.quantity * product.price;
        }
    }
    if (dealOfTheDay && dealOfTheDay.length > 0) {
        for (let data of dealOfTheDay) {
            const deal = yield exports.DealOfTheDay.findOne({ _id: data === null || data === void 0 ? void 0 : data.dealId, storeId: req.body.storeId });
            if (!deal) {
                return res.status(400).json({ error: `Deal with ID ${data === null || data === void 0 ? void 0 : data.dealId} not found.` });
            }
            const existingDeal = cart.dealofthedayId.find((d) => d.dealId.toString() === (data === null || data === void 0 ? void 0 : data.dealId.toString()));
            if (existingDeal) {
                existingDeal.quantity += Number(data === null || data === void 0 ? void 0 : data.quantity) || 0;
            }
            else {
                cart.dealofthedayId.push({ dealId: data === null || data === void 0 ? void 0 : data.dealId, flog: "dealOfDay", quantity: Number(data === null || data === void 0 ? void 0 : data.quantity) || 1 });
            }
            cart.amount += (Number(data === null || data === void 0 ? void 0 : data.quantity) || 0) * (Number(deal.price) || 0);
        }
    }
    cart.storeId = req.body.storeId;
    cart = yield cart.save();
    res.status(200).json({
        message: "Product added to cart",
        previousAmount: initialAmount,
        newAmount: cart.amount,
        cart,
    });
});
exports.add = add;
exports.view = (0, erroHandle_1.errorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield _validation_1.Cart.find({ userId: req.body.cid, storeId: req.body.storeId })
        .populate({
        path: "products.productId",
        model: "product",
    })
        .populate({
        path: "products.optionId",
        model: "option",
    })
        .lean();
    const updatedOrders = yield Promise.all(cart.map((cartItem) => __awaiter(void 0, void 0, void 0, function* () {
        let dealOfTheDayData = [];
        cartItem.totalAmount = cartItem.amount;
        if (cartItem.dealofthedayId && cartItem.dealofthedayId.length > 0) {
            for (let dealItem of cartItem.dealofthedayId) {
                const deal = yield exports.DealOfTheDay.findOne({ _id: dealItem.dealId, storeId: req.body.storeId })
                    .populate({
                    path: "products.productId",
                })
                    .populate({
                    path: "products.optionId",
                })
                    .lean();
                // If deal exists, add it to the dealOfTheDayData array
                if (deal) {
                    dealOfTheDayData.push({
                        dealId: deal._id,
                        flog: "dealOfDay",
                        name: deal.name,
                        image: deal.image,
                        price: deal.price,
                        description: deal.description,
                        quantity: dealItem.quantity,
                        products: deal.products.map(product => (Object.assign({}, product))),
                    });
                }
            }
        }
        cartItem.dealofthedays = dealOfTheDayData;
        // Fetch current cart offer based on totalAmount
        let cartOffer = yield exports.CartOffer.findOne({
            minPrice: { $lte: cartItem.totalAmount },
            maxPrice: { $gte: cartItem.totalAmount },
            storeId: req.body.storeId
        })
            .populate("freeGiftId")
            .populate({
            path: "products.productId",
            model: "product"
        })
            .populate({
            path: "products.optionId",
            model: "option"
        })
            .sort({ minPrice: 1 })
            .lean();
        let nextCartOffer = null;
        if (cartOffer) {
            nextCartOffer = yield exports.CartOffer.findOne({
                minPrice: { $gt: cartOffer.maxPrice },
            })
                .populate("freeGiftId")
                .populate({
                path: "products.productId",
                model: "product"
            })
                .populate({
                path: "products.optionId",
                model: "option"
            })
                .sort({ minPrice: 1 })
                .lean();
        }
        // Populate product and options in the cart offer
        if (cartOffer && cartOffer.products.length > 0) {
            //  const productIds = cartOffer.products.map((p: any) => p.productId);
            // //  const options = await Option.find({ productId: { $in: productIds } }).lean(); 
            cartOffer.products = cartOffer.products.map((product) => (Object.assign({}, product)));
        }
        if (nextCartOffer && nextCartOffer.products.length > 0) {
            //  const nextProductIds = nextCartOffer.products.map((p: any) => p._id);
            //  const nextOptions = await Option.find({ products: { $in: nextProductIds } }).lean();
            nextCartOffer.products = nextCartOffer.products.map((product) => (Object.assign({}, product)));
        }
        cartItem.cartOffer = cartOffer || {};
        cartItem.nextCartOffer = nextCartOffer || {};
        delete cartItem.dealofthedayId;
        delete cartItem.amount;
        return cartItem;
    })));
    return res.status(200).json({ cart: updatedOrders });
}));
const recentCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the latest cart for the user, sorted by the updatedAt field in descending ord
    try {
        let recentCart = yield _validation_1.Cart.aggregate([
            {
                $match: {
                    userId: new mongoose_1.default.Types.ObjectId(req.body.cid),
                    storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId)
                },
            },
            {
                $lookup: {
                    from: "dealoftheday",
                    localField: "dealofthedayId.dealId",
                    foreignField: "_id",
                    as: "dealOfTheDay",
                },
            },
            {
                $unwind: {
                    path: "$dealOfTheDay",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "product",
                    localField: "dealOfTheDay.products.productId",
                    foreignField: "_id",
                    as: "dealProductDetail",
                },
            },
            {
                $unwind: {
                    path: "$dealProductDetail",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "option",
                    let: { dealOptions: "$dealOfTheDay.products.optionId", dealProductId: "$dealProductDetail._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$productId", "$$dealProductId"] },
                                        { $in: ["$_id", "$$dealOptions"] }, // Fetch only matching options
                                    ],
                                },
                            },
                        },
                    ],
                    as: "dealOptions",
                },
            },
            {
                $unwind: {
                    path: "$products",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "option",
                    localField: "products.optionId",
                    foreignField: "_id",
                    as: "options",
                },
            },
            {
                $unwind: {
                    path: "$options",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "product",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetail",
                },
            },
            {
                $unwind: {
                    path: "$productDetail",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    products: {
                        $push: {
                            $cond: {
                                if: { $gt: ["$products", null] },
                                then: {
                                    productId: "$products.productId",
                                    quantity: "$products.quantity",
                                    price: "$products.price",
                                    optionId: "$products.optionId",
                                    optionDetails: "$options",
                                    flog: "product",
                                    details: {
                                        _id: "$productDetail._id",
                                        name: "$productDetail.name",
                                        image: "$productDetail.image",
                                        category: "$productDetail.category",
                                        subCategory: "$productDetail.subCategory",
                                        description: "$productDetail.description",
                                        status: "$productDetail.status",
                                    },
                                },
                                else: "$$REMOVE",
                            },
                        },
                    },
                    dealOfTheDay: {
                        $push: {
                            $cond: {
                                if: { $gt: ["$dealOfTheDay", null] },
                                then: {
                                    dealId: "$dealOfTheDay._id",
                                    flog: "dealOfDay",
                                    quantity: {
                                        $arrayElemAt: [
                                            "$dealofthedayId.quantity",
                                            {
                                                $indexOfArray: ["$dealofthedayId.dealId", "$dealOfTheDay._id"],
                                            },
                                        ],
                                    },
                                    name: "$dealOfTheDay.name",
                                    image: "$dealOfTheDay.image",
                                    price: "$dealOfTheDay.price",
                                    description: "$dealOfTheDay.description",
                                    productDetails: {
                                        _id: "$dealProductDetail._id",
                                        name: "$dealProductDetail.name",
                                        image: "$dealProductDetail.image",
                                        category: "$dealProductDetail.category",
                                        subCategory: "$dealProductDetail.subCategory",
                                        description: "$dealProductDetail.description",
                                        status: "$dealProductDetail.status",
                                    },
                                    optionDetails: {
                                        $arrayElemAt: ["$dealOptions", 0], // Return the first matched option
                                    },
                                },
                                else: "$$REMOVE",
                            },
                        },
                    },
                    totalAmount: { $first: "$amount" },
                    status: { $first: "$status" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                },
            },
            {
                $sort: { updatedAt: -1 }
            },
            {
                $limit: 1
            }
        ]);
        res.json({
            data: recentCart
        });
        const updatedOrders = yield Promise.all(recentCart.map((cartItem) => __awaiter(void 0, void 0, void 0, function* () {
            let dealOfTheDayData = [];
            cartItem.totalAmount = cartItem.amount;
            if (cartItem.dealofthedayId && cartItem.dealofthedayId.length > 0) {
                for (let dealItem of cartItem.dealofthedayId) {
                    const deal = yield exports.DealOfTheDay.findOne({ _id: dealItem.dealId, storeId: req.body.storeId })
                        .populate({
                        path: "products.productId",
                    })
                        .populate({
                        path: "products.optionId",
                    })
                        .lean();
                    // If deal exists, add it to the dealOfTheDayData array
                    if (deal) {
                        dealOfTheDayData.push({
                            dealId: deal._id,
                            flog: "dealOfDay",
                            name: deal.name,
                            image: deal.image,
                            price: deal.price,
                            description: deal.description,
                            quantity: dealItem.quantity,
                            products: deal.products.map(product => (Object.assign({}, product))),
                        });
                    }
                }
            }
            cartItem.dealofthedays = dealOfTheDayData;
            // Fetch current cart offer based on totalAmount
            let cartOffer = yield exports.CartOffer.findOne({
                minPrice: { $lte: cartItem.totalAmount },
                maxPrice: { $gte: cartItem.totalAmount },
                storeId: req.body.storeId
            })
                .populate("freeGiftId")
                .populate({
                path: "products.productId",
                model: "product"
            })
                .populate({
                path: "products.optionId",
                model: "option"
            })
                .sort({ minPrice: 1 })
                .lean();
            let nextCartOffer = null;
            if (cartOffer) {
                nextCartOffer = yield exports.CartOffer.findOne({
                    minPrice: { $gt: cartOffer.maxPrice },
                    storeId: req.body.storeId
                })
                    .populate("freeGiftId")
                    .populate({
                    path: "products.productId",
                    model: "product"
                })
                    .populate({
                    path: "products.optionId",
                    model: "option"
                })
                    .sort({ minPrice: 1 })
                    .lean();
            }
            // Populate product and options in the cart offer
            if (cartOffer && cartOffer.products.length > 0) {
                //  const productIds = cartOffer.products.map((p: any) => p.productId);
                // //  const options = await Option.find({ productId: { $in: productIds } }).lean(); 
                cartOffer.products = cartOffer.products.map((product) => (Object.assign({}, product)));
            }
            if (nextCartOffer && nextCartOffer.products.length > 0) {
                //  const nextProductIds = nextCartOffer.products.map((p: any) => p._id);
                //  const nextOptions = await Option.find({ products: { $in: nextProductIds } }).lean();
                nextCartOffer.products = nextCartOffer.products.map((product) => (Object.assign({}, product)));
            }
            cartItem.cartOffer = cartOffer || {};
            cartItem.nextCartOffer = nextCartOffer || {};
            delete cartItem.dealofthedayId;
            delete cartItem.amount;
            return cartItem;
        })));
        res.status(200).json({ data: updatedOrders });
    }
    catch (error) {
        res.status(200).json({
            message: error
        });
        console.log(error);
    }
});
exports.recentCartItems = recentCartItems;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId, id, productId, optionId, quantity, price, flog } = req.body;
        let cartDetail = yield _validation_1.Cart.findOne({ _id: new mongoose_1.default.Types.ObjectId(id), storeId: req.body.storeId, userId });
        if (!cartDetail) {
            return res.status(404).json({ message: "Cart not found." });
        }
        let index = (_a = cartDetail.products) === null || _a === void 0 ? void 0 : _a.findIndex((x) => {
            var _a, _b;
            return ((_a = x.productId) === null || _a === void 0 ? void 0 : _a.toString()) === productId.toString() &&
                ((_b = x.optionId) === null || _b === void 0 ? void 0 : _b.toString()) === optionId.toString();
        });
        let dealPrice = 0;
        if (cartDetail.dealofthedayId && cartDetail.dealofthedayId.length > 0) {
            const dealPrices = yield Promise.all(cartDetail.dealofthedayId.map((deal) => __awaiter(void 0, void 0, void 0, function* () {
                const dealInfo = yield exports.DealOfTheDay.findOne({ _id: deal.dealId, storeId: req.body.storeId });
                if (dealInfo) {
                    return dealInfo.price * deal.quantity;
                }
                return 0;
            })));
            dealPrice = dealPrices.reduce((total, price) => total + price, 0);
        }
        const newProductTotal = quantity * price;
        if (index !== undefined && index !== -1) {
            cartDetail.products[index].quantity = quantity;
            cartDetail.products[index].price = newProductTotal;
        }
        else {
            cartDetail.products.push({
                productId: new mongoose_1.default.Types.ObjectId(productId),
                optionId: new mongoose_1.default.Types.ObjectId(optionId),
                quantity,
                price: newProductTotal,
                flog,
            });
        }
        let updatedAmount = cartDetail.products.reduce((total, product) => total + product.price, 0);
        updatedAmount += dealPrice;
        cartDetail.amount = updatedAmount;
        console.log("Cart After Update:", cartDetail);
        const cart = yield _validation_1.Cart.findByIdAndUpdate(id, { $set: { products: cartDetail.products, amount: cartDetail.amount } }, { new: true });
        if (!cart) {
            return res.status(500).json({ message: "Cart update failed." });
        }
        return res.status(200).json({ message: "Cart updated successfully", cart });
    }
    catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred." });
    }
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { userId, id, productId, optionId, dealOfTheDayId } = req.body;
        if (!id || !userId) {
            return res.status(400).json({ message: "Cart ID and User ID are required." });
        }
        const cart = yield _validation_1.Cart.findOne({ _id: id, storeId: req.body.storeId });
        if (!cart || cart.userId.toString() !== userId) {
            return res.status(404).json({ message: "Cart not found or does not belong to the user." });
        }
        // If productId, optionId, and dealOfTheDayId are not provided, remove the entire cart entry
        if (!productId && !optionId && !dealOfTheDayId) {
            yield _validation_1.Cart.findByIdAndDelete(id);
            return res.status(200).json({ message: "Cart deleted successfully." });
        }
        // Removing deal of the day from cart
        if (dealOfTheDayId) {
            const dealIndex = cart.dealofthedayId.findIndex((deal) => deal.dealId.toString() === dealOfTheDayId.toString());
            if (dealIndex !== -1) {
                cart.dealofthedayId.splice(dealIndex, 1);
                const dealDetails = yield exports.DealOfTheDay.findOne({ _id: dealOfTheDayId, storeId: req.body.storeId });
                if (dealDetails) {
                    cart.amount -= (_b = dealDetails.price) !== null && _b !== void 0 ? _b : 0;
                }
            }
            else {
                return res.status(404).json({ message: "Deal not found in cart." });
            }
        }
        else {
            if (!productId || !optionId) {
                return res.status(400).json({ message: "Product ID and Option ID are required." });
            }
            const productIndex = cart.products.findIndex((product) => product.productId.toString() === productId.toString() &&
                product.optionId.toString() === optionId.toString());
            if (productIndex !== -1) {
                const product = cart.products[productIndex];
                cart.products.splice(productIndex, 1);
                cart.amount -= product.quantity * product.price;
            }
            else {
                return res.status(400).json({ message: "Product not found in cart." });
            }
        }
        if (cart.products.length === 0 && cart.dealofthedayId.length === 0) {
            yield _validation_1.Cart.findByIdAndDelete({
                _id: id,
                userId: userId,
            });
            return res.status(200).json({ message: "Cart was empty and has been deleted." });
        }
        yield cart.save();
        res.status(200).json({
            message: "Product or Deal removed successfully.",
            cart,
        });
    }
    catch (error) {
        console.error("Error in remove function:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.remove = remove;
const reorder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let order = yield _validation_1.Orders.findOne({ _id: req.body.orderId, storeId: req.body.storeId });
    if (order) {
        let cart = yield _validation_1.Cart.findOne({ userId: req.body.cid, storeId: req.body.storeId });
        if (!cart) {
            cart = new _validation_1.Cart({
                userId: req.body.cid,
                products: order.products,
            });
        }
        else {
            for (let index = 0; index < order.products.length; index++) {
                const element = order.products[index];
                let i = cart.products.findIndex((x) => x.productId.toString() === element.productId.toString());
                if (i != -1) {
                    cart.products[i].quantity += element.quantity;
                }
                else {
                    cart.products.push(element);
                }
            }
        }
        cart.amount = cart.products.reduce((sum, p) => sum + p.quantity * p.price, 0); // Calculate total
        cart = yield cart.save();
        res.status(200).json({ message: "Product added to cart", cart });
    }
    else {
        return res.status(400).json({ message: "No record found." });
    }
});
exports.reorder = reorder;
const couponList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let couponData = yield exports.CouponCode.find({
        status: "enable",
        storeId: req.body.storeId,
        endDate: { $gt: new Date() }
    });
    res.status(200).json({ data: couponData });
});
exports.couponList = couponList;
exports.couponApply = (0, erroHandle_1.errorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, totalAmount } = req.body;
    // Find the coupon by code and ensure it's enabled
    const coupon = yield exports.CouponCode.findOne({ code, status: "enable", storeId: req.body.storeId }).lean();
    if (!coupon) {
        return res.status(400).json({ message: "Invalid or expired coupon code." });
    }
    const currentDate = new Date();
    if (coupon.endDate && new Date(coupon.endDate) < currentDate) {
        return res.status(400).json({ message: "Coupon is not valid at this time." });
    }
    if (totalAmount < coupon.minPrice || totalAmount > coupon.maxPrice) {
        return res.status(400).json({
            message: `Coupon is only valid for orders between ₹${coupon.minPrice} and ₹${coupon.maxPrice}.`,
        });
    }
    if (coupon.limit !== 0 && coupon.limit <= 0) {
        return res.status(400).json({ message: "Coupon usage limit reached." });
    }
    let discountAmount = 0;
    if (coupon.type === "percentage") {
        discountAmount = (totalAmount * coupon.discount) / 100;
    }
    else if (coupon.type === "rupees") {
        discountAmount = coupon.discount;
    }
    discountAmount = Math.min(discountAmount, totalAmount);
    yield exports.CouponCode.findByIdAndUpdate(coupon._id, { $inc: { limit: -1 } });
    res.status(200).json({
        message: "Coupon applied successfully.",
        discountAmount: discountAmount,
        finalAmount: totalAmount - discountAmount,
    });
}));
//# sourceMappingURL=cart.js.map