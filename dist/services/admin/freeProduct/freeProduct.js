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
exports.uploadImage = exports.remove = exports.view = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const upload_1 = require("../../../helper/upload");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield _validation_1.FreeProduct.find({
        storeId: req.body.storeId
    })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: product });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, _validation_1.validateAdd)(req.body);
        if (error)
            throw error;
        let product = yield _validation_1.FreeProduct.findOne({ name: req.body.name, storeId: req.body.storeId });
        if (product)
            return res.status(400).json({ error: { name: "Name is already exists." } });
        let newFreeProduct = new _validation_1.FreeProduct(lodash_1.default.pick(req.body, [
            "name",
            "image",
            "price",
            "stock",
            "storeId"
        ]));
        newFreeProduct = yield newFreeProduct.save();
        res.status(200).json({ message: "Product added successfully.", data: newFreeProduct });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            message: err,
        });
    }
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let productName = yield _validation_1.FreeProduct.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id },
        storeId: req.body.storeId
    });
    if (productName)
        return res.status(400).json({ error: { name: "Name is already exists." } });
    let product = yield _validation_1.FreeProduct.findOne({ _id: req.params.id, storeId: req.body.storeId });
    if (!product) {
        return res.status(400).json({ message: "No record found." });
    }
    product.name = req.body.name;
    if (req.body.image)
        product.image = req.body.image;
    if (req.body.price)
        product.price = req.body.price;
    if (req.body.stock)
        product.stock = req.body.stock;
    product = yield product.save();
    res.status(200).json({ message: "Product updated successfully.", product, });
});
exports.update = update;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let product = yield _validation_1.FreeProduct.findOne({
        _id: req.params.id,
        storeId: req.body.storeId
    });
    if (!product)
        return res.status(404).json({ message: "No record found." });
    res.status(200).json({
        data: product,
    });
});
exports.view = view;
// export const changeStatus = async (req: Request, res: Response) => {
//   const { error } = validateStatus(req.body);
//   if (error) throw error;
//   let product: any = await FreeProduct.findOne({ _id: req.body.id });
//   if (!product) return res.status(400).json({ message: "No record found." });
//   product.status = req.body.status;
//   product = await FreeProduct.save();
//   res.status(200).json({ message: "Status changed successfully." });
// };
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.params.id;
        let check = yield _validation_1.FreeProduct.findOne({ _id: id, storeId: req.body.storeId });
        if (!check) {
            throw new Error("No record found.");
        }
        yield _validation_1.FreeProduct.deleteOne({ _id: id, storeId: req.body.storeId });
        res.status(200).json({ message: "Product deleted successfully." });
    }
    catch (err) {
        res.status(400).json({
            message: err,
        });
    }
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
//# sourceMappingURL=freeProduct.js.map