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
exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = __importDefault(require("mongoose"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mostReviewedItems = yield _validation_1.Reviews.aggregate([
        { $match: {
                storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId), // Filter by storeId
            }
        },
        {
            $group: {
                _id: "$productId",
                reviewCount: { $sum: 1 }, // Count the number of reviews
            },
        },
        {
            $sort: { reviewCount: -1 }, // Sort by review count in descending order
        },
        {
            $lookup: {
                from: "product",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        {
            $unwind: "$productDetails", // Unwind the productDetails array
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                reviewCount: 1,
                productName: "$productDetails.name",
                price: "$productDetails.price",
                description: "$productDetails.description",
                image: "$productDetails.image",
            },
        },
    ]);
    res.status(200).json({ data: mostReviewedItems });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.productId || !req.body.rating) {
        return res
            .status(400)
            .json({ message: "productId and rating are required." });
    }
    if (req.body.rating < 1 || req.body.rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }
    let newReview = new _validation_1.Reviews(lodash_1.default.pick(req.body, ["productId", "rating", "comment,", "storeId"]));
    newReview.userId = req.body.cid;
    newReview = yield newReview.save();
    res.status(200).json({ message: "Review added successfully." });
});
exports.add = add;
//# sourceMappingURL=reviews.js.map