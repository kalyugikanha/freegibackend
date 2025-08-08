"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
const users_1 = require("../../../models/users");
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
//# sourceMappingURL=_validation.js.map