"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addon_1 = require("./addon");
const handleAction_1 = __importDefault(require("./utils/handleAction"));
class LowLevelHook extends addon_1._Hook {
    constructor(options) {
        super();
        this.isRunning = false;
        this._register(options.device, options.button, true, handleAction_1.default.call(this, options));
    }
    /**
     * adds {@link listener} for given {@link device}, {@link button} and {@link state}
     * @param state
     * * if {@link button} is `"wheel"`: `true` for wheel going forward, `false` for wheel going back,
     * * overwise: `true` for {@link button} press, `false` for {@link button} release
     * @returns unlisten method
     */
    static on(device, button, state, listener) {
        const hook = new addon_1._Hook();
        //@ts-expect-error
        hook._register(device, button, state, listener);
        return () => hook.delete();
    }
}
exports.default = LowLevelHook;
//# sourceMappingURL=LowLevelHook.js.map