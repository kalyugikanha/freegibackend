"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
require("express-async-errors");
const errorHandler = (error, req, res, next) => {
    if (error && (error === null || error === void 0 ? void 0 : error.details)) { // Error of Joi
        let err = {};
        error.details.forEach((el) => {
            let key = el.path.join('_');
            err[key] = el.message;
        });
        // let err: string = error.details[0]?.message;
        res.status(400).json({ error: err });
    }
    else if (error.errors) { // Error of mongoose validator
        let err = {};
        Object.keys(error.errors).forEach(e => {
            err[e] = error.errors[e].message;
        });
        res.status(400).json({ error: err });
    }
    else {
        console.error(error);
        res.status(error.status || 500).json({ message: error.message });
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map