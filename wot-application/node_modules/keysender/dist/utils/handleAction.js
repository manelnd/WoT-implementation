"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const constants_1 = require("../constants");
function handleAction(options) {
    var _a, _b;
    if ("defaultState" in options) {
        this.state = options.defaultState;
    }
    const { mode } = options;
    if (mode === "once") {
        const action = options.action.bind(this);
        this.stop = () => {
            throw new Error('available only for "toggle" and "hold" modes');
        };
        return async () => {
            if (!this.isRunning) {
                this.isRunning = true;
                await action();
                this.isRunning = false;
            }
        };
    }
    let innerToggler = false;
    let outerToggler = true;
    let reason;
    let completion;
    this.stop = function (_reason) {
        if (this.isRunning) {
            reason = arguments.length ? _reason : constants_1.Reason.BY_STOP;
            outerToggler = false;
            return completion.then(() => {
                reason = undefined;
                outerToggler = true;
            });
        }
    };
    const action = options.action.bind(this);
    const isEnable = ((_a = options.isEnable) === null || _a === void 0 ? void 0 : _a.bind(this)) || (() => true);
    const before = ((_b = options.before) === null || _b === void 0 ? void 0 : _b.bind(this)) || _1.noop;
    let after;
    if (options.after) {
        const fn = options.after.bind(this);
        after = () => fn(outerToggler
            ? innerToggler
                ? constants_1.Reason.BY_ACTION
                : constants_1.Reason.BY_KEYBOARD
            : reason);
    }
    else {
        after = _1.noop;
    }
    const { delay = constants_1.DEFAULT_DELAY } = options;
    const getFn = (getInnerToggler) => async () => {
        if (!this.isRunning) {
            let resolve;
            completion = new Promise((_resolve) => {
                resolve = _resolve;
            });
            this.isRunning = true;
            if (await isEnable()) {
                await before();
                while (outerToggler && getInnerToggler() && (await action())) {
                    await (0, _1.sleep)(delay);
                }
                await after();
            }
            this.isRunning = innerToggler = false;
            resolve();
        }
    };
    if (mode === "hold") {
        return getFn(() => (innerToggler = this._getButtonState()));
    }
    if (mode === "toggle") {
        const fn = getFn(() => innerToggler);
        return () => {
            if ((innerToggler = !innerToggler)) {
                fn();
            }
        };
    }
    throw new Error("Wrong mode");
}
exports.default = handleAction;
//# sourceMappingURL=handleAction.js.map