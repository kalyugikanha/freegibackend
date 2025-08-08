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
exports.getDetails = exports.update = exports.remove = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield _validation_1.dealoftheday.aggregate([
            {
                $match: { storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId) },
            },
            {
                $lookup: {
                    from: "product",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "option",
                    localField: "products.optionId",
                    foreignField: "_id",
                    as: "optionDetails",
                },
            },
            { $unwind: { path: "$optionDetails", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    price: { $first: "$price" },
                    image: { $first: "$image" },
                    description: { $first: "$description" },
                    storeId: { $first: "$storeId" },
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
        res.status(200).json({ message: "Successfully fetched.", data });
    }
    catch (error) {
        console.error("Error fetching deal of the day list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, _validation_1.validate)(req.body);
        if (error)
            throw error;
        const { products, name, price, description, image } = req.body;
        let existingDeal = yield _validation_1.dealoftheday.findOne({ name, storeId: req.body.storeId });
        if (existingDeal) {
            return res.status(200).json({ error: { name: "Deal with this name already exists." } });
        }
        for (const product of products) {
            const { productId, optionId } = product;
            const productExists = yield _validation_1.Product.findOne({
                _id: productId,
                storeId: req.body.storeId,
            });
            if (!productExists) {
                return res.status(400).json({ error: { message: `Product with ID ${productId} does not exist.` } });
            }
            const optionExists = yield _validation_1.Option.findOne({
                _id: optionId,
                productId: productId,
                storeId: req.body.storeId,
            });
            if (!optionExists) {
                return res.status(400).json({ error: { message: `Option with ID ${optionId} does not exist.` } });
            }
            if (optionExists.productId.toString() !== productId) {
                return res.status(400).json({ error: { message: `Option with ID ${optionId} does not belong to Product with ID ${productId}.` } });
            }
        }
        const newDeal = new _validation_1.dealoftheday({
            name,
            image,
            price,
            description,
            products,
            storeId: req.body.storeId,
        });
        yield newDeal.save();
        res.status(200).json({ message: "New deal created successfully.", data: newDeal });
    }
    catch (error) {
        console.error("Error adding deal of the day:", error);
        res.status(400).json({ error: { name: "Internal server error." } });
    }
});
exports.add = add;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let checkout = yield _validation_1.dealoftheday.findOne({
        _id: id,
        storeId: req.body.storeId,
    });
    if (!checkout) {
        throw new Error("No record found.");
    }
    yield _validation_1.dealoftheday.deleteOne({ _id: id, storeId: req.body.storeId });
    res.status(200).json({ message: "Product deleted successfully." });
});
exports.remove = remove;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, products, image } = req.body;
        const id = req.params.id;
        let existingDeal = yield _validation_1.dealoftheday.findOne({
            _id: id,
            storeId: req.body.storeId,
        });
        if (!existingDeal) {
            return res.status(404).json({ error: { name: "Deal not found." } });
        }
        if (name) {
            const nameExists = yield _validation_1.dealoftheday.findOne({
                name,
                _id: { $ne: existingDeal._id },
                storeId: req.body.storeId,
            });
            if (nameExists) {
                return res.status(400).json({ error: { name: "Deal name already exists." } });
            }
            existingDeal.name = name;
        }
        if (products && Array.isArray(products)) {
            for (const product of products) {
                const { productId, optionId } = product;
                const productExists = yield _validation_1.Product.findOne({
                    _id: productId,
                    storeId: req.body.storeId,
                });
                if (!productExists) {
                    return res.status(400).json({ error: { message: `Product with ID ${productId} does not exist.` } });
                }
                const optionExists = yield _validation_1.Option.findOne({
                    _id: optionId,
                    productId: productId,
                    storeId: req.body.storeId,
                });
                if (!optionExists) {
                    return res.status(400).json({ error: { message: `Option with ID ${optionId} does not exist.` } });
                }
                if (optionExists.productId.toString() !== productId) {
                    return res.status(400).json({ error: { message: `Option with ID ${optionId} does not belong to Product with ID ${productId}.` } });
                }
            }
            existingDeal.products = products;
        }
        existingDeal.price = price !== null && price !== void 0 ? price : existingDeal.price;
        existingDeal.description = description !== null && description !== void 0 ? description : existingDeal.description;
        existingDeal.updatedAt = new Date();
        existingDeal.image = image !== null && image !== void 0 ? image : existingDeal.image;
        existingDeal.updatedAt = new Date();
        existingDeal.storeId = req.body.storeId;
        yield existingDeal.save();
        res.status(200).json({ message: "Deal updated successfully.", data: existingDeal });
    }
    catch (error) {
        console.error("Error updating deal:", error);
        res.status(400).json({ error: { name: "Internal Server Error." } });
    }
});
exports.update = update;
const getDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let deal = yield _validation_1.dealoftheday.findOne({
        _id: id,
        storeId: req.body.storeId,
    }).populate({
        path: "products.productId",
        model: "product",
    }).populate({
        path: "products.optionId",
        model: "option",
    });
    res.status(200).json({ message: "Deal fetched successfully.", data: deal });
});
exports.getDetails = getDetails;
//# sourceMappingURL=dealoftheday.js.map