"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addon_1 = require("./addon");
const utils_1 = require("./utils");
const getWindowChildren = (...args) => 
//@ts-expect-error
(0, addon_1._getWindowChildren)(...(0, utils_1.stringsToBuffers)(args)).map(utils_1.normalizeWindowInfo);
exports.default = getWindowChildren;
//# sourceMappingURL=getWindowChildren.js.map