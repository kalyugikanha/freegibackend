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
    const message = yield _validation_1.Message.find({
        chatId: req.body.chatId,
    })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: message });
});
exports.list = list;
//# sourceMappingURL=message.js.map