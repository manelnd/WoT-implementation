"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addon_1 = require("./addon");
const utils_1 = require("./utils");
const getAllWindows = () => (0, addon_1._getAllWindows)().map(utils_1.normalizeWindowInfo);
exports.default = getAllWindows;
//# sourceMappingURL=getAllWindows.js.map