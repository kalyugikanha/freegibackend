"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const error_1 = require("../middleware/error");
const routes_1 = __importDefault(require("../services/routes"));
const path_1 = __importDefault(require("path"));
exports.default = (app) => {
    app.use((0, helmet_1.default)());
    app.use((0, express_1.json)());
    app.use((0, cors_1.default)());
    app.use((Request, Response, next) => {
        Response.header("Access-Control-Allow-Origin", "*"); // Adjust as necessary
        Response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        Response.header("Access-Control-Expose-Headers", "x-auth-token"); // Expose the custom header
        next();
    });
    app.use("/files", express_1.default.static(path_1.default.join(__dirname, "../../files")));
    app.use("/", routes_1.default);
    app.use((req, res) => {
        res.status(404).json({ message: "URL not found." });
    });
    app.use(error_1.errorHandler);
};
//# sourceMappingURL=router.js.map