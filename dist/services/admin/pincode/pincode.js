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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePinCode = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield _validation_1.PinCode.find({
        storeId: req.body.storeId
    });
    res.status(200).json({ data: data });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pincode = yield _validation_1.PinCode.findOne({
        pincode: req.body.pincode,
        storeId: req.body.storeId
    });
    if (pincode) {
        return res.status(400).json({ message: "Pincode already exists." });
    }
    let data = new _validation_1.PinCode({
        pincode: req.body.pincode,
        storeId: req.body.storeId,
    });
    yield data.save();
    res.status(200).json({ message: "Pincode added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let checkout = yield _validation_1.PinCode.findOne({
        _id: req.params.id,
        storeId: req.body.storeId
    });
    if (!checkout) {
        return res.status(404).json({ message: "No record found." });
    }
    let data = yield _validation_1.PinCode.findOne({
        pincode: req.body.pincode,
        storeId: req.body.storeId
    });
    if (data && data._id != req.params.id) {
        return res.status(400).json({ message: "Pincode already exists." });
    }
    yield _validation_1.PinCode.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true });
    res.status(200).json({ message: "Pincode updated successfully." });
});
exports.update = update;
const deletePinCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let checkout = yield _validation_1.PinCode.findOne({
        _id: id,
        storeId: req.body.storeId
    });
    if (!checkout) {
        return res.status(404).json({ message: "No record found." });
    }
    yield _validation_1.PinCode.deleteOne({ _id: id, storeId: req.body.storeId });
    res.status(200).json({ message: "Pincode deleted successfully." });
});
exports.deletePinCode = deletePinCode;
//# sourceMappingURL=pincode.js.map