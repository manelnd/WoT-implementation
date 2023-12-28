"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addon_1 = require("./addon");
const handleAction_1 = __importDefault(require("./utils/handleAction"));
class GlobalHotkey extends addon_1._GlobalHotkey {
    /**
     * Registers a hotkey, if any hotkey is already registered for this {@link GlobalHotkeyOptions.key key}, {@link GlobalHotkey.unregister unregisters} the previous hotkey and registers a new hotkey
     */
    constructor(options) {
        super();
        this.isRunning = false;
        this._register(options.key, handleAction_1.default.call(this, options));
    }
}
exports.default = GlobalHotkey;
//# sourceMappingURL=GlobalHotkey.js.map