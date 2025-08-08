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
exports.search = exports.list = exports.Cart = exports.Option = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const option_1 = require("../../../models/option");
const cart_1 = require("../../../models/cart");
exports.Option = (0, mongoose_2.model)("option", option_1.optionSchema);
exports.Cart = (0, mongoose_2.model)("Cart", cart_1.cartSchema);
// export const list = async (req: Request, res: Response) => {
//   // let filter: any = new Object();
//   // if (req.body.status) {
//   //   filter["status"] = req.body.status;
//   // }
//   // if (req.body.category) {
//   //   filter["category"] = req.body.category;
//   // }
//   // if (req.body.subCategory) {
//   //   filter["subCategory"] = req.body.subCategory;
//   // }
//   // const product = await Product.find({
//   //   $and: [filter],
//   // })
//   //   .populate("category", { name: 1, image: 1 })
//   //   .populate("subCategory", { name: 1 })
//   //   .sort({ _id: -1 })
//   //   .lean();
//   let match: any = {
//     $match: {
//       storeId: new mongoose.Types.ObjectId(req.body.storeId)
//     }
//   };
//   if (req.body.category && req.body.category != "") {
//     match = {
//       $match: {
//         category: new mongoose.Types.ObjectId(req.body.category),
//       }
//     }
//   }
//   if (req.body.status) {
//     if (req.body.category && req.body.category != "") {
//       match = {
//         $match: {
//           category: new mongoose.Types.ObjectId(req.body.category),
//           status: req.body.status
//         }
//       }
//     }
//     else {
//       match = {
//         $match: {
//           status: req.body.status
//         }
//       }
//     }
//   }
//   let subCategory: any = {
//     $match: {}
//   };
//   if (req.body.subCategory && req.body.subCategory != "") {
//     match = {
//       $match: {
//         subCategory: new mongoose.Types.ObjectId(req.body.subCategory)
//       }
//     }
//   }
//   let sorting: any = { _id: -1 };
//   if (req.body.isAcceding != undefined) {
//     sorting = { name: req.body.isAcceding ? 1 : -1 };
//   }
//   else if (req.body.isHigh != undefined) {
//     sorting = { price: req.body.isHigh ? -1 : 1 };
//   }
//   else if (req.body.popularity != undefined) {
//     sorting = { rating: req.body.popularity ? -1 : 1 };
//   }
//   const userId = new mongoose.Types.ObjectId(req.body.cid);
//   const product = await Product.aggregate([
//     match,
//     subCategory,
//     {
//       $lookup: {
//         from: "reviews",
//         let: { id: "$_id" },
//         pipeline: [{
//           $match: {
//             $expr: { $eq: ["$productId", "$$id"] }
//           }
//         }],
//         as: "reviews"
//       }
//     },
//     {
//       $lookup: {
//         from: "wish",
//         let: { id: userId },
//         pipeline: [{
//           $match: {
//             $expr: { $eq: ["$userId", "$$id"] }
//           }
//         }],
//         as: "wishDetail"
//       }
//     },
//     {
//       $unwind: {
//         "path": "$wishDetail",
//         "preserveNullAndEmptyArrays": true
//       }
//     },
//     {
//       $addFields: {
//         "isWish": {
//           $in: ["$_id", { $ifNull: ["$wishDetail.productId", []] }]
//         }
//       }
//     },
//     {
//       $project: {
//         name: 1,
//         image: 1,
//         status: 1,
//         description: 1,
//         price: 1,
//         stock: 1,
//         imageList: 1,
//         // totalReview: { $size: "$reviews" },
//         isWish: 1,
//         rating: {
//           $round: [{
//             $multiply: [{
//               $divide: [{
//                 $sum: "$reviews.rating"
//               },
//               {
//                 $multiply: [5, {
//                   $cond: {
//                     if: {
//                       $eq: [{
//                         $size: "$reviews"
//                       }, 0]
//                     },
//                     then: 1,
//                     else: {
//                       $size: "$reviews"
//                     }
//                   }
//                 }]
//               }]
//             }, 5]
//           }, 1]
//         }
//       }
//     },
//     {
//       $sort: sorting
//     }])
//     console.log("--sorting-- "+sorting);
//     console.log("--product-- "+product);
//     const cart = userId ? await Cart.findOne({ userId: userId,storeId:req.body.storeId}) : null; 
//     // res.json({
//     //   data:cart
//     // })
//     const productsWithOptionCount = await Promise.all(
//       product.map(async (product: any) => {
//         const options = await Option.find({ productId: product._id ,storeId:req.body.storeId});
//         const optionStockSum = await Option.aggregate([
//           { $match: { productId: product._id, storeId:new mongoose.Types.ObjectId(req.body.storeId) } },
//           { $group: { _id: null, totalStock: { $sum: "$stock" } } },
//         ]);
//         const productStockCount =
//           optionStockSum.length > 0 ? optionStockSum[0].totalStock : 0;
//         product.stock = productStockCount;
//         product.totalCartQuantity = 0; 
//         product.options = options.map((option: any) => {
//           option = option.toObject();
//           const cartProductOptionQty = userId
//             ? cart?.products.find(
//                 (item: any) =>
//                   item.productId.toString() === product._id.toString() &&
//                   item.optionId.toString() === option._id.toString()
//               )
//             : null;
//           option.cartOptionQty = cartProductOptionQty
//             ? cartProductOptionQty.quantity
//             : 0;
//           if (userId) {
//             product.totalCartQuantity += option.cartOptionQty;
//           }
//           return option;
//         });
//         return product;
//       })
//     );
//     res.status(200).json({ data: productsWithOptionCount });
// };
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let match = {
        $match: {
            storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId)
        }
    };
    if (req.body.category && req.body.category != "") {
        match = {
            $match: {
                category: new mongoose_1.default.Types.ObjectId(req.body.category),
            }
        };
    }
    if (req.body.status) {
        if (req.body.category && req.body.category != "") {
            match = {
                $match: {
                    category: new mongoose_1.default.Types.ObjectId(req.body.category),
                    status: req.body.status
                }
            };
        }
        else {
            match = {
                $match: {
                    status: req.body.status
                }
            };
        }
    }
    let subCategory = {
        $match: {}
    };
    if (req.body.subCategory && req.body.subCategory != "") {
        match = {
            $match: {
                subCategory: new mongoose_1.default.Types.ObjectId(req.body.subCategory)
            }
        };
    }
    let sorting = { _id: -1 };
    if (req.body.isAcceding != undefined) {
        sorting = { name: req.body.isAcceding ? 1 : -1 };
    }
    else if (req.body.isHigh != undefined) {
        sorting = { price: req.body.isHigh ? -1 : 1 };
    }
    else if (req.body.popularity != undefined) {
        sorting = { rating: req.body.popularity ? -1 : 1 };
    }
    const userId = new mongoose_1.default.Types.ObjectId(req.body.cid);
    let product = yield _validation_1.Product.aggregate([
        match,
        subCategory,
        {
            $lookup: {
                from: "reviews",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$productId", "$$id"] }
                        }
                    }
                ],
                as: "reviews"
            }
        },
        {
            $lookup: {
                from: "wish",
                let: { id: userId },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$userId", "$$id"] }
                        }
                    }
                ],
                as: "wishDetail"
            }
        },
        {
            $unwind: {
                path: "$wishDetail",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                isWish: {
                    $in: ["$_id", { $ifNull: ["$wishDetail.productId", []] }]
                }
            }
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
                                                        else: { $size: "$reviews" }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                5
                            ]
                        },
                        1
                    ]
                }
            }
        },
        {
            $sort: sorting
        }
    ]);
    // ✅ Remove duplicates by _id
    const seenIds = new Set();
    product = product.filter(p => {
        const id = p._id.toString();
        if (seenIds.has(id))
            return false;
        seenIds.add(id);
        return true;
    });
    const cart = userId
        ? yield exports.Cart.findOne({ userId: userId, storeId: req.body.storeId })
        : null;
    const productsWithOptionCount = yield Promise.all(product.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const options = yield exports.Option.find({ productId: product._id, storeId: req.body.storeId });
        const optionStockSum = yield exports.Option.aggregate([
            {
                $match: {
                    productId: product._id,
                    storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: "$stock" }
                }
            }
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
            option.cartOptionQty = cartProductOptionQty ? cartProductOptionQty.quantity : 0;
            if (userId) {
                product.totalCartQuantity += option.cartOptionQty;
            }
            return option;
        });
        return product;
    })));
    res.status(200).json({ data: productsWithOptionCount });
});
exports.list = list;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = new mongoose_1.default.Types.ObjectId(req.body.cid);
    const product = yield _validation_1.Product.aggregate([{
            $match: {
                name: { $regex: req.body.search, $options: 'i' },
                storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId)
            }
        },
        {
            $lookup: {
                from: "reviews",
                let: { id: "$_id" },
                pipeline: [{
                        $match: {
                            $expr: { $eq: ["$productId", "$$id"] }
                        }
                    }],
                as: "reviews"
            }
        },
        {
            $lookup: {
                from: "wish",
                let: { id: userId },
                pipeline: [{
                        $match: {
                            $expr: { $eq: ["$userId", "$$id"] }
                        }
                    }],
                as: "wishDetail"
            }
        },
        {
            $unwind: {
                "path": "$wishDetail",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $addFields: {
                "isWish": {
                    $in: ["$_id", { $ifNull: ["$wishDetail.productId", []] }]
                }
            }
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
                // totalReview: { $size: "$reviews" },
                isWish: 1,
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
    const productsWithOptionCount = yield Promise.all(product.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const options = yield exports.Option.find({ productId: product._id, });
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
    res.status(200).json({ data: productsWithOptionCount });
});
exports.search = search;
//# sourceMappingURL=product.js.map