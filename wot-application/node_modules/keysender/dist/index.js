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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reason = exports.sleep = exports.disableInput = exports.isButtonPressed = exports.getScreenSize = exports.vkToString = exports.getWindowChildren = exports.getAllWindows = exports.textToImg = exports.LowLevelHook = exports.GlobalHotkey = exports.Virtual = exports.Hardware = void 0;
var worker_1 = require("./worker");
Object.defineProperty(exports, "Hardware", { enumerable: true, get: function () { return worker_1.Hardware; } });
Object.defineProperty(exports, "Virtual", { enumerable: true, get: function () { return worker_1.Virtual; } });
var GlobalHotkey_1 = require("./GlobalHotkey");
Object.defineProperty(exports, "GlobalHotkey", { enumerable: true, get: function () { return __importDefault(GlobalHotkey_1).default; } });
var LowLevelHook_1 = require("./LowLevelHook");
Object.defineProperty(exports, "LowLevelHook", { enumerable: true, get: function () { return __importDefault(LowLevelHook_1).default; } });
var textToImg_1 = require("./textToImg");
Object.defineProperty(exports, "textToImg", { enumerable: true, get: function () { return __importDefault(textToImg_1).default; } });
var getAllWindows_1 = require("./getAllWindows");
Object.defineProperty(exports, "getAllWindows", { enumerable: true, get: function () { return __importDefault(getAllWindows_1).default; } });
var getWindowChildren_1 = require("./getWindowChildren");
Object.defineProperty(exports, "getWindowChildren", { enumerable: true, get: function () { return __importDefault(getWindowChildren_1).default; } });
var addon_1 = require("./addon");
Object.defineProperty(exports, "vkToString", { enumerable: true, get: function () { return addon_1.vkToString; } });
Object.defineProperty(exports, "getScreenSize", { enumerable: true, get: function () { return addon_1.getScreenSize; } });
Object.defineProperty(exports, "isButtonPressed", { enumerable: true, get: function () { return addon_1.isButtonPressed; } });
Object.defineProperty(exports, "disableInput", { enumerable: true, get: function () { return addon_1.disableInput; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "sleep", { enumerable: true, get: function () { return utils_1.sleep; } });
var constants_1 = require("./constants");
Object.defineProperty(exports, "Reason", { enumerable: true, get: function () { return constants_1.Reason; } });
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map