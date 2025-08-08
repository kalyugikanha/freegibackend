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
    const productCount = yield _validation_1.Product.countDocuments({});
    const orderCount = yield _validation_1.Order.countDocuments();
    const paymentCount = yield _validation_1.Payment.aggregate([
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
            },
        },
    ]);
    const customerCount = yield _validation_1.Users.find({ role: "Customer" }).countDocuments();
    const deliveryAgentCount = yield _validation_1.Users.find({
        role: "DeliveryAgent",
    }).countDocuments();
    const categoryCount = yield _validation_1.Category.countDocuments();
    res.status(200).json({
        product: productCount || 0,
        order: orderCount || 0,
        payment: paymentCount || 0,
        customer: customerCount || 0,
        driver: deliveryAgentCount || 0,
        category: categoryCount || 0,
    });
});
exports.list = list;
//# sourceMappingURL=count.js.map