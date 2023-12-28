"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCancelable = exports.normalizeWindowInfo = exports.getFontName = exports.toBGR = exports.noop = exports.bindPick = exports.lazyGetters = exports.stringsToBuffers = exports.sleep = exports.random = void 0;
const fs_1 = __importDefault(require("fs"));
const resolvedPromise = Promise.resolve();
const random = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;
exports.random = random;
const sleep = (delay) => {
    if (typeof delay != "number") {
        delay = (0, exports.random)(delay[0], delay[1]);
    }
    return delay
        ? new Promise((resolve) => {
            setTimeout(resolve, delay);
        })
        : resolvedPromise;
};
exports.sleep = sleep;
const stringsToBuffers = (args) => args.map((item) => typeof item === "string" ? Buffer.from(item, "ucs2") : item);
exports.stringsToBuffers = stringsToBuffers;
const lazyGetters = (self, modules) => {
    for (const key in modules) {
        Object.defineProperty(self, key, {
            configurable: true,
            get() {
                const value = modules[key]();
                Object.defineProperty(self, key, { value });
                return value;
            },
        });
    }
};
exports.lazyGetters = lazyGetters;
const bindPick = (worker, keys) => keys.reduce((acc, key) => ({ ...acc, [key]: worker[key].bind(worker) }), {});
exports.bindPick = bindPick;
const noop = function () { };
exports.noop = noop;
const rgbToBgr = (color) => ((color & 0xff) << 16) |
    (((color >> 8) & 0xff) << 8) |
    ((color >> 16) & 0xff);
const toBGR = (color) => {
    switch (typeof color) {
        case "number":
            return rgbToBgr(color);
        case "string":
            return rgbToBgr(parseInt(color, 16));
        default:
            return ((color[0] & 0xff) | ((color[1] >> 8) & 0xff) | ((color[2] >> 16) & 0xff));
    }
};
exports.toBGR = toBGR;
const getOffset = (data) => {
    for (let i = data.getUint16(4, false), pos = 12; i--; pos += 16) {
        if (String.fromCodePoint(data.getInt8(pos), data.getInt8(pos + 1), data.getInt8(pos + 2), data.getInt8(pos + 3)) === "name") {
            return data.getUint32(pos + 8, false);
        }
    }
};
const getFontName = (path) => {
    const data = new DataView(fs_1.default.readFileSync(path).buffer, 0);
    let offset = getOffset(data);
    if (offset !== undefined) {
        const keyPos = offset + data.getUint16(offset + 4);
        offset += 6;
        for (let i = data.getUint16(offset + 2); i--;) {
            const t = data.getUint16(offset);
            offset += 6;
            if ((t === 0 || t === 3) && data.getUint16(offset) === 4) {
                const fontFullName = new Uint16Array(data.getUint16(offset + 2) / 2);
                for (let i = 0, charPos = keyPos + data.getUint16(offset + 4); i < fontFullName.length; i++, charPos += 2) {
                    fontFullName[i] = data.getUint16(charPos);
                }
                return Buffer.from(fontFullName);
            }
            offset += 6;
        }
    }
    throw new Error(`Something wrong with font '${path}'`);
};
exports.getFontName = getFontName;
const normalizeWindowInfo = (windowInfo) => ({
    ...windowInfo,
    className: windowInfo.className.toString("ucs2"),
    title: windowInfo.title.toString("ucs2"),
});
exports.normalizeWindowInfo = normalizeWindowInfo;
const makeCancelable = (fn) => {
    const cancelRef = { isCanceled: exports.noop };
    const cancelableFn = fn.bind(cancelRef);
    let promise;
    cancelableFn.cancelCurrent = () => {
        if (!promise && cancelRef.isCancelable) {
            promise = new Promise((resolve) => {
                cancelRef.isCanceled = () => {
                    cancelRef.isCanceled = exports.noop;
                    delete cancelRef.isCancelable;
                    resolve();
                    promise = undefined;
                    return true;
                };
            });
        }
        return promise || resolvedPromise;
    };
    return cancelableFn;
};
exports.makeCancelable = makeCancelable;
//# sourceMappingURL=index.js.map