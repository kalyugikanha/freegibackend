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
exports.selectDefault = exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = __importDefault(require("mongoose"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    const address = yield _validation_1.Address.find({
        $and: [filter, { userId: new mongoose_1.default.Types.ObjectId(req.body.userId) }],
    })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: address });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let address = yield _validation_1.Address.findOne({
        tag: req.body.tag,
        userId: req.body.cid,
    });
    if (address)
        return res.status(400).json({ message: "Tag is already exists." });
    let newAddress = new _validation_1.Address(lodash_1.default.pick(req.body, ["tag", "addressType", "floor", "address", "landMark", "pincode", "lat", "long"]));
    newAddress.userId = req.body.cid;
    newAddress = yield newAddress.save();
    res.status(200).json({ message: "Address added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let addressTag = yield _validation_1.Address.findOne({
        tag: req.body.tag,
        userId: req.body.cid,
        $ne: { _id: req.body.id },
    });
    if (addressTag === req.body.id)
        return res.status(400).json({ message: "Tag is already exists." });
    let address = yield _validation_1.Address.findOne({ _id: req.body.id });
    if (!address)
        return res.status(400).json({ message: "No record found." });
    if (req.body.tag)
        address.tag = req.body.tag;
    if (req.body.addressType)
        address.addressType = req.body.addressType;
    if (req.body.floor)
        address.floor = req.body.floor;
    if (req.body.address)
        address.address = req.body.address;
    if (req.body.landMark)
        address.landMark = req.body.landMark;
    if (req.body.pincode)
        address.pincode = req.body.pincode;
    if (req.body.lat)
        address.lat = req.body.lat;
    if (req.body.long)
        address.long = req.body.long;
    address = yield address.save();
    res.status(200).json({ message: "Address updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
    // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });
    yield _validation_1.Address.deleteOne({ _id: req.body.id });
    res.status(200).json({ message: "Address deleted successfully." });
});
exports.remove = remove;
const selectDefault = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateSelectDefault)(req.body);
    if (error)
        throw error;
    let address = yield _validation_1.Address.findOne({ _id: new mongoose_1.default.Types.ObjectId(req.body.id) });
    if (!address)
        return res.status(400).json({ message: "No record found." });
    yield _validation_1.Address.updateMany({ userId: new mongoose_1.default.Types.ObjectId(req.body.userId) }, { $set: { default: false } });
    yield _validation_1.Address.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.body.id) }, { $set: { default: true } });
    res.status(200).json({ message: "Default Address set successfully." });
});
exports.selectDefault = selectDefault;
//# sourceMappingURL=address.js.map