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
exports.userAuth = void 0;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const encription_1 = require("../helper/encription");
const _validation_1 = require("../services/customer/login/_validation");
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["x-auth-token"];
        if (!token)
            return res.status(401).json({ message: "Authentication failed!" });
        token = yield (0, encription_1.decrypt)(token);
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        console.log(decodedToken);
        let _id = decodedToken.cid ? decodedToken.cid : null;
        let storeId = decodedToken.storeId ? decodedToken.storeId : null;
        let users = yield _validation_1.Users.findOne({ _id: _id });
        if (!users)
            return res.status(401).json({ message: "Authentication failed!" });
        req.body.storeId = storeId;
        req.body.cid = _id;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Authentication failed!" });
    }
});
exports.userAuth = userAuth;
//# sourceMappingURL=auth.js.map