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
exports.list = exports.Cart = exports.Option = exports.Product = exports.dealoftheday = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dealoftheday_1 = require("../../../models/dealoftheday");
const product_1 = require("../../../models/product");
exports.dealoftheday = (0, mongoose_1.model)("dealoftheday", dealoftheday_1.dealofthedaySchema);
exports.Product = (0, mongoose_1.model)("Product", product_1.productSchema);
const option_1 = require("../../../models/option");
const cart_1 = require("../../../models/cart");
exports.Option = (0, mongoose_1.model)("option", option_1.optionSchema);
exports.Cart = (0, mongoose_1.model)("Cart", cart_1.cartSchema);
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let match = {
        $match: {
            storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId)
        }
    };
    const userId = new mongoose_1.default.Types.ObjectId(req.body.userId);
    try {
        const data = yield exports.dealoftheday.aggregate([
            match,
            {
                $unwind: "$products", // Unwind the products array
            },
            {
                $lookup: {
                    from: "product",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $lookup: {
                    from: "option",
                    localField: "products.optionId",
                    foreignField: "_id",
                    as: "optionDetails",
                },
            },
            { $unwind: "$optionDetails" },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    price: { $first: "$price" },
                    image: { $first: "$image" },
                    description: { $first: "$description" },
                    products: {
                        $push: {
                            productId: "$products.productId",
                            optionId: "$products.optionId",
                            productDetails: "$productDetails",
                            optionDetails: "$optionDetails",
                        },
                    },
                },
            },
        ]);
        const cart = userId ? yield exports.Cart.findOne({ userId: userId, storeId: req.body.storeId }) : null;
        const dealsWithCartQuantity = data.map((deal) => {
            let cartDealQuantity = 0;
            if (userId && cart) {
                const cartDeal = cart.dealofthedayId.find((item) => item.dealId.toString() === deal._id.toString());
                if (cartDeal) {
                    cartDealQuantity = cartDeal.quantity;
                }
            }
            return Object.assign(Object.assign({}, deal), { cartDealQuantity });
        });
        res.status(200).json({ message: "Successfully fetched.", data: dealsWithCartQuantity });
    }
    catch (error) {
        console.error("Error fetching deal of the day list:", error);
        res.status(400).json({ error: "Internal Server Error" });
    }
});
exports.list = list;
//# sourceMappingURL=dealOfTheDay.js.map