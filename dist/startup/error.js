"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    process.on('unhandledRejection', (error) => {
        throw error;
    });
};
//# sourceMappingURL=error.js.map