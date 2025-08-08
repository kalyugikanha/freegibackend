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
exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const area = yield _validation_1.Area.find().sort({ _id: -1 }).lean();
    res.status(200).json({ data: area });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: { data: error === null || error === void 0 ? void 0 : error.message.replace(/\"/g, "").toString() } });
    let address = yield _validation_1.Area.findOne({
        name: req.body.name,
        userId: req.body.cid,
    });
    if (address)
        return res.status(400).json({ message: "Area is already exists." });
    let newAddress = new _validation_1.Area(lodash_1.default.pick(req.body, ["name", "pincode"]));
    newAddress.userId = req.body.cid;
    newAddress = yield newAddress.save();
    const area = yield _validation_1.Area.find({ userId: req.body.cid })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: area, message: "Area added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: { data: error === null || error === void 0 ? void 0 : error.message.replace(/\"/g, "").toString() } });
    let addressTag = yield _validation_1.Area.findOne({
        name: req.body.name,
        userId: req.body.cid,
    });
    if (addressTag)
        return res.status(400).json({ message: "Area is already exists." });
    let area = yield _validation_1.Area.findOne({ _id: req.body.id });
    if (!area)
        return res.status(400).json({ message: "No record found." });
    if (req.body.name)
        area.name = req.body.name;
    if (req.body.pincode)
        area.pincode = req.body.pincode;
    area = yield area.save();
    res.status(200).json({ message: "Area updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: { data: error === null || error === void 0 ? void 0 : error.message.replace(/\"/g, "").toString() } });
    // let task = await Task.findOne({ taskCategory: req.body.id, company: req.body._cid });
    // if (task) return res.status(400).json({ message: 'Category can\'t be deleted. First remove all task of this category.' });
    yield _validation_1.Area.deleteOne({ _id: req.body.id });
    res.status(200).json({ message: "Area deleted successfully." });
});
exports.remove = remove;
//# sourceMappingURL=area.js.map