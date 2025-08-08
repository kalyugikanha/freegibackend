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
exports.list = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    // const category = await Category.find({
    //   $and: [filter],
    // })
    //   .sort({ _id: -1 })
    //   .lean();
    const category = yield _validation_1.Category.aggregate([{
            $match: {
                $and: [filter],
                storeId: new mongoose_1.default.Types.ObjectId(req.body.storeId),
            },
        },
        {
            $lookup: {
                from: "subCategory",
                let: { id: "$_id" },
                pipeline: [{
                        $match: {
                            $expr: { $eq: ["$category", "$$id"] },
                            status: "enable"
                        }
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }],
                as: "subCategory"
            }
        },
        {
            $sort: {
                _id: -1
            }
        }]);
    res.status(200).json({ data: category });
});
exports.list = list;
//# sourceMappingURL=category.js.map