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
exports.remove = exports.view = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const _ = __importStar(require("lodash"));
const erroHandle_1 = require("../../../helper/erroHandle");
exports.list = (0, erroHandle_1.errorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const product = yield _validation_1.CartOffer.find({ storeId: (_a = req.body) === null || _a === void 0 ? void 0 : _a.storeId }).populate({
        path: "products.productId",
        model: "product",
    }).populate({
        path: "products.optionId",
        model: "option",
    }).populate({
        path: "freeGiftId",
        model: "freeProduct",
    }).sort({
        _id: -1,
    });
    res.status(200).json({ data: product });
}));
exports.add = (0, erroHandle_1.errorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    // Check if product name already exists
    const existingProduct = yield _validation_1.CartOffer.findOne({ name: req.body.name, storeId: req.body.storeId });
    if (existingProduct)
        return res.status(400).json({ error: { name: "Name already exists." } });
    // Validate products array
    if (req.body.products && req.body.products.length > 0) {
        const invalidProduct = req.body.products.some((p) => !p.productId || !p.optionId);
        if (invalidProduct) {
            return res.status(400).json({ error: "Each product must have both productId and optionId." });
        }
    }
    else if (!req.body.freeGiftId) {
        return res.status(400).json({ error: "Either products array or freeGiftId is required." });
    }
    // Create new CartOffer entry
    const newCartOffer = new _validation_1.CartOffer(_.pick(req.body, ["name", "minPrice", "maxPrice", "freeGiftId", "products", "isFreeDeliver", "storeId"]));
    yield newCartOffer.save();
    return res.status(201).json({ message: "Cart offer added successfully.", data: newCartOffer });
}));
exports.update = (0, erroHandle_1.errorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        return res.status(400).json({ error: error.details.map((err) => err.message) });
    const { name, freeGiftId, products, minPrice, maxPrice, isFreeDeliver } = req.body;
    const { id } = req.params;
    const existingOffer = yield _validation_1.CartOffer.findOne({ name, _id: { $ne: id }, storeId: req.body.storeId });
    if (existingOffer)
        return res.status(400).json({ error: { name: "Name already exists." } });
    let updateFields = {};
    if (name)
        updateFields.name = name;
    if (minPrice !== undefined)
        updateFields.minPrice = minPrice;
    if (maxPrice !== undefined)
        updateFields.maxPrice = maxPrice;
    if (isFreeDeliver !== undefined)
        updateFields.isFreeDeliver = isFreeDeliver;
    if (products)
        updateFields.products = products;
    if (freeGiftId)
        updateFields.freeGiftId = freeGiftId;
    const updatedOffer = yield _validation_1.CartOffer.findByIdAndUpdate(id, { $set: updateFields }, {
        new: true,
        runValidators: true
    });
    if (!updatedOffer)
        throw new Error('"Cart offer not found');
    res.status(200).json({ message: "Cart offer updated successfully.", offer: updatedOffer });
}));
exports.view = (0, erroHandle_1.errorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield _validation_1.CartOffer.findOne({
        storeId: req.body.storeId
    }).populate({
        path: "products.productId",
        model: "product",
    }).populate({
        path: "products.optionId",
        model: "option",
    }).populate({
        path: "freeGiftId",
        model: "freeProduct",
    }).sort({
        _id: -1,
    }).lean();
    res.status(200).json({
        data: product || {},
    });
}));
// export const changeStatus = async (req: Request, res: Response) => {
//   const { error } = validateStatus(req.body);
//   if (error) throw error;
//   let product: any = await CartOffer.findOne({ _id: req.body.id });
//   if (!product) return res.status(400).json({ message: "No record found." });
//   product.status = req.body.status;
//   product = await CartOffer.save();
//   res.status(200).json({ message: "Status changed successfully." });
// };
exports.remove = (0, erroHandle_1.errorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let check = yield _validation_1.CartOffer.findOne({ _id: id, storeId: req.body.storeId });
    if (!check) {
        throw new Error("No record found.");
    }
    yield _validation_1.CartOffer.deleteOne({ _id: id });
    res.status(200).json({ message: "Product deleted successfully." });
}));
// export const uploadImage = async (req: Request, res: Response) => {
//   try{
//   await fileUpload(req, res, async (err: any) => {
//     if (err) return res.status(400).json({ message: err.message });
//     if (!req.body.filename)
//       return res.status(400).json({ message: "Please select the file." });
//     res.status(200).json({
//       message: "File uploaded successfully.",
//       data: {
//         filename: req.body.filename,
//       },
//     });
//   });
// }
// catch(error)
// {
//   res.status(200).json({
//     message: error
//   });
// }
// };
//# sourceMappingURL=cartOffer.js.map