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
exports.deliveryEnd = exports.update = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = __importDefault(require("mongoose"));
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let driver = yield _validation_1.DriverGeoLocation.findOne({ driver: req.body.cid, orderId: new mongoose_1.default.Types.ObjectId(req.body.orderId) });
    if (driver) {
        driver.lat = req.body.lat;
        driver.long = req.body.long;
        driver.orderId = req.body.orderId;
        driver.updatedAt = new Date().toISOString();
        driver = yield driver.save();
        yield _validation_1.Orders.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.body.orderId) }, { $set: { status: "shipped" } });
    }
    else {
        let payload = lodash_1.default.pick(req.body, ["date", "lat", "long", "orderId"]);
        let geoLocation = new _validation_1.DriverGeoLocation(payload);
        geoLocation.date = new Date().toISOString();
        geoLocation.driver = req.body.cid;
        geoLocation.orderId = req.body.orderId;
        geoLocation = yield geoLocation.save();
        yield _validation_1.Orders.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.body.orderId) }, { $set: { status: "confirmed", deliveryAgent: req.body.cid, updatedAt: new Date().toISOString() } });
    }
    res.status(200).json({ message: "Geo Location saved successfully." });
});
exports.update = update;
const deliveryEnd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDeliveryEnd)(req.body);
    if (error)
        throw error;
    // const order: any = await Orders.findOne({ orderId: req.body.orderId });
    yield _validation_1.Orders.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.body.orderId) }, { $set: { status: "delivered", deliveryDate: new Date().toISOString(), updatedAt: new Date().toISOString() } });
    res.status(200).json({ message: "End delivery successfully." });
});
exports.deliveryEnd = deliveryEnd;
//# sourceMappingURL=geoLocation.js.map