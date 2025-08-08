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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
mongoose_1.default.set("strictQuery", true);
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (config_1.default.has("dbUrl")) {
            const db = config_1.default.get("dbUrl");
            yield mongoose_1.default.connect(db);
            console.log("Database Connected Successfully...");
        }
        else {
            console.log("Unable to connect database, please try again later");
            process.exit(1);
        }
    }
    catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
});
//# sourceMappingURL=db.js.map