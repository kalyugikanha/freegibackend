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
exports.remove = exports.add = exports.list = exports.Option = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importStar(require("mongoose"));
const option_1 = require("../../../models/option");
exports.Option = (0, mongoose_1.model)("option", option_1.optionSchema);
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield _validation_1.featureditem.aggregate([{
                $match: { storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId) },
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
            }]);
        const productsWithOptionCount = yield Promise.all(data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = item.productDetail;
            // Fetch product options
            const options = yield exports.Option.find({ productId: product._id, storeId: req.body.storeId });
            // Calculate total stock for options
            const optionStockSum = yield exports.Option.aggregate([
                { $match: { productId: product._id, storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId) } },
                { $group: { _id: null, totalStock: { $sum: "$stock" } } }
            ]);
            const productStockCount = optionStockSum.length > 0 ? optionStockSum[0].totalStock : 0;
            product.stock = productStockCount;
            product.options = options;
            return item;
        })));
        res.status(200).json({ message: "Successfully fetched.", data: productsWithOptionCount });
    }
    catch (error) {
        console.error("Error fetching featured items:", error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validate)(req.body);
    if (error)
        throw error;
    if (req.body.productIds.length == 0)
        return res.status(400).json({ error: { name: "please select product ids." } });
    const productIds = req.body.productIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
    const foundProducts = yield _validation_1.Product.find({
        _id: { $in: productIds },
        storeId: req.body.storeId,
    });
    const foundProductIds = foundProducts.map((product) => product._id.toString());
    const missingProductIds = req.body.productIds.filter((id) => !foundProductIds.includes(id));
    if (missingProductIds.length > 0) {
        return res.status(404).json({
            error: {
                name: "Some products not found.",
                missingProductIds: missingProductIds,
            },
        });
    }
    for (let index = 0; index < req.body.productIds.length; index++) {
        const element = req.body.productIds[index];
        let featureditemData = yield _validation_1.featureditem.findOne({ productId: element, storeId: req.body.storeId, });
        if (featureditemData)
            return res.status(400).json({ error: { name: "Product is already exists." } });
        let newFeatureditem = new _validation_1.featureditem();
        newFeatureditem.productId = element;
        newFeatureditem.storeId = req.body.storeId;
        newFeatureditem = yield newFeatureditem.save();
    }
    res.status(200).json({ message: "Product added successfully." });
});
exports.add = add;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateRemove)(req.body);
    if (error)
        throw error;
    ;
    yield _validation_1.featureditem.deleteOne({ _id: req.body.id, storeId: req.body.storeId, });
    res.status(200).json({ message: "Product deleted successfully." });
});
exports.remove = remove;
//# sourceMappingURL=featureditem.js.map