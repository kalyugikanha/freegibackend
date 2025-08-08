"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messages_1 = require("../../../models/messages");
exports.Message = (0, mongoose_1.model)("Message", messages_1.messageSchema);
//# sourceMappingURL=_validation.js.map