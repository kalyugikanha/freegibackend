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
exports.remove = exports.list = exports.add = exports.Cart = exports.Option = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const option_1 = require("../../../models/option");
const cart_1 = require("../../../models/cart");
exports.Option = (0, mongoose_2.model)("option", option_1.optionSchema);
exports.Cart = (0, mongoose_2.model)("Cart", cart_1.cartSchema);
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validate)(req.body);
    if (error)
        throw error;
    const wishDetail = yield _validation_1.wish.findOne({ userId: new mongoose_1.default.Types.ObjectId(req.body.userId), storeId: req.body.storeId });
    if (wishDetail) {
        yield _validation_1.wish.findByIdAndUpdate({ _id: wishDetail._id }, { $push: { productId: req.body.productId } }, { $set: { updatedAt: new Date().toISOString() } });
    }
    else {
        let newWisht = new _validation_1.wish();
        newWisht.userId = req.body.userId;
        newWisht.storeId = req.body.storeId;
        newWisht.productId = [req.body.productId];
        newWisht.createdAt = new Date().toISOString();
        newWisht.updatedAt = new Date().toISOString();
        newWisht = yield newWisht.save();
    }
    res.status(200).json({ message: "Added successfully." });
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateList)(req.body);
    if (error)
        throw error;
    let userId = req.body.userId;
    const list = yield _validation_1.wish.aggregate([{
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(req.body.userId),
                storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId)
            }
        },
        {
            $unwind: {
                "path": "$productId",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "product",
                let: { id: "$productId" },
                pipeline: [{
                        $match: {
                            $expr: { $eq: ["$_id", "$$id"] }
                        }
                    }],
                as: "productDetail"
            }
        },
        {
            $unwind: "$productDetail"
        },
        {
            $lookup: {
                from: "reviews",
                let: { id: "$productDetail._id" },
                pipeline: [{
                        $match: {
                            $expr: { $eq: ["$productId", "$$id"] }
                        }
                    }],
                as: "reviews"
            }
        },
        {
            $addFields: {
                rating: {
                    $round: [{
                            $multiply: [{
                                    $divide: [{
                                            $sum: "$reviews.rating"
                                        },
                                        {
                                            $multiply: [5, {
                                                    $cond: {
                                                        if: {
                                                            $eq: [{
                                                                    $size: "$reviews"
                                                                }, 0]
                                                        },
                                                        then: 1,
                                                        else: {
                                                            $size: "$reviews"
                                                        }
                                                    }
                                                }]
                                        }]
                                }, 5]
                        }, 1]
                }
            }
        }]);
    const cart = userId ? yield exports.Cart.findOne({ userId: userId, storeId: req.body.storeId }) : null;
    const productsWithOptionCount = yield Promise.all(list.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = item.productDetail;
        const options = yield exports.Option.find({ productId: product._id, storeId: req.body.storeId });
        const optionStockSum = yield exports.Option.aggregate([
            { $match: { productId: product._id, storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId) } },
            { $group: { _id: null, totalStock: { $sum: "$stock" } } },
        ]);
        const productStockCount = optionStockSum.length > 0 ? optionStockSum[0].totalStock : 0;
        product.stock = productStockCount;
        product.totalCartQuantity = 0;
        product.options = options.map((option) => {
            option = option.toObject();
            const cartProductOptionQty = userId
                ? cart === null || cart === void 0 ? void 0 : cart.products.find((item) => item.productId.toString() === product._id.toString() &&
                    item.optionId.toString() === option._id.toString())
                : null;
            option.cartOptionQty = cartProductOptionQty
                ? cartProductOptionQty.quantity
                : 0;
            if (userId) {
                product.totalCartQuantity += option.cartOptionQty;
            }
            return option;
        });
        return product;
    })));
    res.status(200).json({ message: "Wish detail successfully.", data: productsWithOptionCount });
});
exports.list = list;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validate)(req.body);
    if (error)
        throw error;
    const wishDetail = yield _validation_1.wish.findOne({ userId: new mongoose_1.default.Types.ObjectId(req.body.userId), storeId: req.body.storeId });
    if (wishDetail) {
        yield _validation_1.wish.findByIdAndUpdate({ _id: wishDetail._id }, { $pull: { productId: new mongoose_1.default.Types.ObjectId(req.body.productId) } }, { $set: { updatedAt: new Date().toISOString() } });
        res.status(200).json({ message: "Removed successfully." });
    }
    else {
        return res.status(400).json({ message: "No record found." });
    }
});
exports.remove = remove;
//# sourceMappingURL=wish.js.map