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
exports.uploadImage = exports.remove = exports.changeStatus = exports.view = exports.update = exports.add = exports.list = exports.Option = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const upload_1 = require("../../../helper/upload");
const mongoose_1 = require("mongoose");
const option_1 = require("../../../models/option");
exports.Option = (0, mongoose_1.model)("option", option_1.optionSchema);
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    const product = yield _validation_1.Product.find({
        $and: [filter],
        storeId: req.body.storeId
    })
        .populate("category", { name: 1, image: 1, icon: 1 })
        .populate("subCategory", { name: 1, icon: 1 })
        .sort({ _id: -1 })
        .lean();
    const productsWithOptionCount = yield Promise.all(product.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const options = yield exports.Option.find({ productId: product._id, storeId: req.body.storeId });
        const optionStockSum = yield exports.Option.aggregate([
            { $match: { productId: product._id, storeId: req.body.storeId } },
            { $group: { _id: null, totalStock: { $sum: "$stock" } } },
        ]);
        const productStockCount = optionStockSum.length > 0 ? optionStockSum[0].totalStock : 0;
        product.stock = productStockCount;
        product.options = options;
        return product;
    })));
    res.status(200).json({ data: productsWithOptionCount });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, _validation_1.validateAdd)(req.body);
        if (error)
            throw error;
        let product = yield _validation_1.Product.findOne({ name: req.body.name, storeId: req.body.storeId });
        if (product)
            return res.status(400).json({ error: { name: "Name is already exists." } });
        let newProduct = new _validation_1.Product(lodash_1.default.pick(req.body, [
            "name",
            "category",
            "subCategory",
            "imageList",
            "description",
            "image",
            "status",
            'storeId'
        ]));
        newProduct = yield newProduct.save();
        if (req.body.options && req.body.options.length > 0) {
            const optionsData = req.body.options.map((option) => ({
                productId: newProduct._id,
                title: option.title,
                mass: option.mass,
                stock: option.stock,
                price: option.price,
                storeId: req.body.storeId
            }));
            // Save options
            yield exports.Option.insertMany(optionsData);
        }
        const options = yield exports.Option.find({ productId: newProduct._id, storeId: req.body.storeId });
        res.status(200).json({ message: "Product added successfully.", data: newProduct, options: options });
    }
    catch (err) {
        console.log(err);
        res.status(200).json({
            message: err,
        });
    }
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let productName = yield _validation_1.Product.findOne({
        name: req.body.name,
        _id: { $ne: req.body.id },
        storeId: req.body.storeId,
    });
    if (productName)
        return res.status(400).json({ error: { name: "Name is already exists." } });
    let product = yield _validation_1.Product.findOne({ _id: req.body.id, storeId: req.body.storeId });
    if (!product) {
        return res.status(400).json({ message: "No record found." });
    }
    product.name = req.body.name;
    if (req.body.image)
        product.image = req.body.image;
    if (req.body.imageList)
        product.imageList = req.body.imageList;
    if (req.body.description)
        product.description = req.body.description;
    // if (req.body.price) product.price = req.body.price;
    if (req.body.category)
        product.category = req.body.category;
    if (req.body.subCategory)
        product.subCategory = req.body.subCategory;
    // if (req.body.stock) product.stock = req.body.stock;
    if (req.body.status && req.body.status !== "")
        product.status = req.body.status;
    product = yield product.save();
    if (req.body.options && req.body.options.length > 0) {
        yield exports.Option.deleteMany({ productId: product._id, storeId: req.body.storeId });
        const optionsData = req.body.options.map((option) => ({
            productId: product._id,
            title: option.title,
            mass: option.mass,
            stock: option.stock,
            price: option.price,
            storeId: req.body.storeId
        }));
        // Save options
        yield exports.Option.insertMany(optionsData);
    }
    const options = yield exports.Option.find({ productId: product._id, storeId: req.body.storeId });
    res.status(200).json({ message: "Product updated successfully.", product, options });
});
exports.update = update;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let product = yield _validation_1.Product.findOne({
        _id: req.body.id,
        storeId: req.body.storeId
    });
    if (!product)
        return res.status(404).json({ message: "No record found." });
    res.status(200).json({
        data: product,
    });
});
exports.view = view;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateStatus)(req.body);
    if (error)
        throw error;
    let product = yield _validation_1.Product.findOne({ _id: req.body.id, storeId: req.body.storeId });
    if (!product)
        return res.status(400).json({ message: "No record found." });
    product.status = req.body.status;
    product = yield product.save();
    res.status(200).json({ message: "Status changed successfully." });
});
exports.changeStatus = changeStatus;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
    // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });
    yield _validation_1.Product.deleteOne({ _id: req.body.id, storeId: req.body.storeId });
    yield exports.Option.deleteMany({ productId: req.body.id, storeId: req.body.storeId });
    res.status(200).json({ message: "Product deleted successfully." });
});
exports.remove = remove;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, upload_1.fileUpload)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return res.status(400).json({ message: err.message });
            if (!req.body.filename)
                return res.status(400).json({ message: "Please select the file." });
            res.status(200).json({
                message: "File uploaded successfully.",
                data: {
                    filename: req.body.filename,
                },
            });
        }));
    }
    catch (error) {
        res.status(200).json({
            message: error
        });
    }
});
exports.uploadImage = uploadImage;
// export const deleteImage = async (req: Request, res: Response) => {
//     if (!req.body.filename || req.body.filename === '') return res.status(400).json({ message: "File is not selected." });
//     await fileDelete(req.body.filename);
//     res.status(200).json({ message: "File deleted successfully." });
// };
//# sourceMappingURL=product.js.map