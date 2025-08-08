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
exports.list = void 0;
const _validation_1 = require("./_validation");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    const couponCode = yield _validation_1.CouponCode.find({
        $and: [filter],
        storeId: req.body.storeId
    })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: couponCode });
});
exports.list = list;
//# sourceMappingURL=couponCode.js.map