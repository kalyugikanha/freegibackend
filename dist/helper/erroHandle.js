"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.error("Error:", err);
            res.status(200).json({
                action: false,
                message: err.message || "An error occurred.",
            });
        });
    };
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=erroHandle.js.map