"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Virtual = exports.Hardware = void 0;
const addon_1 = require("./addon");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const handleSetWorkwindow = (worker) => (...args) => {
    worker.setWorkwindow(...(0, utils_1.stringsToBuffers)(args));
};
const handleWorker = (WorkerClass) => class {
    constructor(...args) {
        const worker = new WorkerClass();
        handleSetWorkwindow(worker).apply(null, args);
        (0, utils_1.lazyGetters)(this, {
            keyboard() {
                const _toggleKey = (key, state) => {
                    worker.toggleKey(key, state);
                    return (0, utils_1.sleep)(constants_1.MICRO_DELAY);
                };
                const _toggleKeys = async (keys, state) => {
                    const l = keys.length - 1;
                    let i;
                    if (state) {
                        for (i = 0; i < l; i++) {
                            await _toggleKey(keys[i], true);
                        }
                    }
                    else {
                        for (i = l; i > 0; i--) {
                            await _toggleKey(keys[i], false);
                        }
                    }
                    worker.toggleKey(keys[i], state);
                };
                const sendKey = async (key, delayAfterPress = constants_1.DEFAULT_DELAY, delayAfterRelease = 0) => {
                    if (Array.isArray(key)) {
                        await _toggleKeys(key, true);
                        await (0, utils_1.sleep)(delayAfterPress);
                        await _toggleKeys(key, false);
                    }
                    else {
                        worker.toggleKey(key, true);
                        await (0, utils_1.sleep)(delayAfterPress);
                        worker.toggleKey(key, false);
                    }
                    return (0, utils_1.sleep)(delayAfterRelease);
                };
                return {
                    printText: (0, utils_1.makeCancelable)(async function (text, delayAfterCharTyping = 0, delay = 0) {
                        if (text) {
                            if (delayAfterCharTyping) {
                                this.isCancelable = true;
                                const it = new Intl.Segmenter()
                                    .segment(text)[Symbol.iterator]();
                                let curr = it.next();
                                for (let next = it.next(); !next.done; next = it.next()) {
                                    if (this.isCanceled()) {
                                        return;
                                    }
                                    worker.printChar(Buffer.from(curr.value.segment, "ucs2"));
                                    await (0, utils_1.sleep)(delayAfterCharTyping);
                                    curr = next;
                                }
                                if (this.isCanceled()) {
                                    return;
                                }
                                delete this.isCancelable;
                                worker.printChar(Buffer.from(curr.value.segment, "ucs2"));
                            }
                            else {
                                worker.printChar(Buffer.from(text, "ucs2"));
                            }
                        }
                        return (0, utils_1.sleep)(delay);
                    }),
                    async toggleKey(key, state, delay = 0) {
                        if (Array.isArray(key)) {
                            await _toggleKeys(key, state);
                        }
                        else {
                            worker.toggleKey(key, state);
                        }
                        return (0, utils_1.sleep)(delay);
                    },
                    sendKey,
                    sendKeys: (0, utils_1.makeCancelable)(async function (keys, delayAfterPress = constants_1.DEFAULT_DELAY, delayAfterRelease = constants_1.DEFAULT_DELAY, delay = 0) {
                        this.isCancelable = true;
                        const l = keys.length - 1;
                        for (let i = 0; i < l; i++) {
                            if (this.isCanceled()) {
                                return;
                            }
                            await sendKey(keys[i], delayAfterPress, delayAfterRelease);
                        }
                        if (this.isCanceled()) {
                            return;
                        }
                        delete this.isCancelable;
                        return sendKey(keys[l], delayAfterPress, delay);
                    }),
                };
            },
            mouse() {
                const _getSign = () => (Math.random() > 0.5 ? 1 : -1);
                const _tremor = (probability) => Math.random() <= probability ? _getSign() : 0;
                const _curveMaker = (t, start, curveDot1, curveDot2, end) => {
                    const invertT = 1 - t;
                    const invertT2 = invertT * invertT;
                    const t2 = t * t;
                    return Math.floor(invertT2 * invertT * start +
                        3 * invertT2 * t * curveDot1 +
                        3 * invertT * t2 * curveDot2 +
                        t2 * t * end);
                };
                const _curveDotMaker = (start, end, deviation) => Math.round(start + (end - start) * (0.5 + _getSign() * deviation));
                const _firstCurveDotMaker = (start, end, deviation, sign) => Math.round(start + sign * (end - start) * deviation);
                const moveTo = (x, y, delay = 0) => {
                    worker.move(x, y, true);
                    return (0, utils_1.sleep)(delay);
                };
                const toggle = (button, state, delay = 0) => {
                    worker.toggleMb(button, state);
                    return (0, utils_1.sleep)(delay);
                };
                return {
                    ...(0, utils_1.bindPick)(worker, ["getPos"]),
                    toggle,
                    async click(button = "left", delayAfterPress = constants_1.DEFAULT_DELAY, delayAfterRelease = 0) {
                        await toggle(button, true, delayAfterPress);
                        return toggle(button, false, delayAfterRelease);
                    },
                    moveTo,
                    humanMoveTo: (0, utils_1.makeCancelable)(async function (xE, yE, speed = 5, deviation = 30, delay = 0) {
                        deviation /= 100;
                        const sleepTime = speed >= 1 ? 1 : Math.round(1 / speed);
                        const { x, y } = worker.lastCoords;
                        if (x === xE && y === yE) {
                            return;
                        }
                        this.isCancelable = true;
                        const partLength = (0, utils_1.random)(50, 200) / 2;
                        const partsTotal = Math.ceil(Math.pow(Math.pow(xE - x, 2) + Math.pow(yE - y, 2), 0.5) /
                            partLength);
                        const xPartLength = (xE - x) / partsTotal;
                        const yPartLength = (yE - y) / partsTotal;
                        const speedMultiplier = (speed > 1 ? speed + 2 : 3) / partLength;
                        let partsLeft = partsTotal;
                        let isLastOne = partsTotal === 1;
                        let parts;
                        let xPartEnd;
                        let yPartEnd;
                        let xPartStart = x;
                        let yPartStart = y;
                        if (!isLastOne) {
                            parts = (0, utils_1.random)(1, Math.ceil(partsTotal / 2));
                            xPartEnd = x + xPartLength * parts;
                            yPartEnd = y + yPartLength * parts;
                        }
                        else {
                            parts = 1;
                            xPartEnd = xE;
                            yPartEnd = yE;
                        }
                        let getCurveDots = () => {
                            getCurveDots = () => ({
                                curveDotX1: _curveDotMaker(xPartStart, xPartEnd, (0, utils_1.random)(deviation / 3, deviation)),
                                curveDotY1: _curveDotMaker(yPartStart, yPartEnd, (0, utils_1.random)(deviation / 3, deviation / 2)),
                                curveDotX2: _curveDotMaker(xPartStart, xPartEnd, (0, utils_1.random)(0, deviation)),
                                curveDotY2: _curveDotMaker(yPartStart, yPartEnd, (0, utils_1.random)(0, deviation / 2)),
                            });
                            return {
                                curveDotX1: _firstCurveDotMaker(xPartStart, xPartEnd, (0, utils_1.random)(deviation / 2, deviation), 1),
                                curveDotY1: _firstCurveDotMaker(yPartStart, yPartEnd, (0, utils_1.random)(deviation / 4, deviation / 3), 1),
                                curveDotX2: _firstCurveDotMaker(xPartStart, xPartEnd, (0, utils_1.random)(deviation / 2, deviation), _getSign()),
                                curveDotY2: _firstCurveDotMaker(yPartStart, yPartEnd, (0, utils_1.random)(deviation / 2, deviation), _getSign()),
                            };
                        };
                        const tremorProbability = speed / 15;
                        while (true) {
                            const { curveDotX1, curveDotX2, curveDotY1, curveDotY2 } = getCurveDots();
                            const dotIterator = speedMultiplier / parts;
                            const count = 1 / dotIterator;
                            for (let i = 1; i < count; i++) {
                                if (this.isCanceled()) {
                                    return;
                                }
                                const t = i * dotIterator;
                                await moveTo(_curveMaker(t, xPartStart, curveDotX1, curveDotX2, xPartEnd), _curveMaker(t, yPartStart, curveDotY1, curveDotY2, yPartEnd) + _tremor(tremorProbability), sleepTime);
                            }
                            if (this.isCanceled()) {
                                return;
                            }
                            if (isLastOne) {
                                delete this.isCancelable;
                                await moveTo(xE, yE, delay);
                                return;
                            }
                            await moveTo(xPartEnd, yPartEnd + _tremor(tremorProbability), sleepTime);
                            partsLeft -= parts;
                            xPartStart = xPartEnd;
                            yPartStart = yPartEnd;
                            if (partsLeft > 2) {
                                parts = (0, utils_1.random)(1, partsLeft - 1);
                                xPartEnd += xPartLength * parts;
                                yPartEnd += yPartLength * parts;
                            }
                            else {
                                parts = partsLeft;
                                xPartEnd = xE;
                                yPartEnd = yE;
                                isLastOne = true;
                            }
                        }
                    }),
                    move(x, y, delay = 0) {
                        worker.move(x, y, false);
                        return (0, utils_1.sleep)(delay);
                    },
                    scrollWheel(amount, delay = 0) {
                        worker.scrollWheel(amount);
                        return (0, utils_1.sleep)(delay);
                    },
                };
            },
            workwindow() {
                const _add0 = (item) => (item.length > 1 ? item : "0" + item);
                const _hex = (...rgb) => rgb.reduce((hex, color) => hex + _add0(color.toString(16)), "");
                return {
                    ...(0, utils_1.bindPick)(worker, [
                        "refresh",
                        "setForeground",
                        "isForeground",
                        "isOpen",
                        "capture",
                        "kill",
                        "close",
                        "getView",
                        "setView",
                    ]),
                    set: handleSetWorkwindow(worker),
                    get: () => (0, utils_1.normalizeWindowInfo)(worker.getWorkwindow()),
                    colorAt(x, y, format = "string") {
                        const bgr = worker.getColor(x, y);
                        const r = bgr & 0xff;
                        const g = (bgr >> 8) & 0xff;
                        const b = (bgr >> 16) & 0xff;
                        switch (format) {
                            case "array":
                                return [r, g, b];
                            case "number":
                                return (r << 16) | (g << 8) | b;
                            case "string":
                                return _hex(r, g, b);
                            default:
                                throw new Error("wrong format");
                        }
                    },
                };
            },
        });
    }
};
/** Provides methods implementations on hardware level. */
exports.Hardware = handleWorker(addon_1._Hardware);
/** Provides methods implementations on virtual level. */
exports.Virtual = handleWorker(addon_1._Virtual);
//# sourceMappingURL=worker.js.map