"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addon_1 = require("./addon");
const utils_1 = require("./utils");
/**
 * Draws text using the specified font `(supports .ttf and .otf only)`
 * @param text - text to draw
 * @param path - path to font
 * @param fontSize - font size in px
 */
const textToImg = (text, path, fontSize, options = {}) => (0, addon_1._textToImg)(Buffer.from(text, "ucs2"), Buffer.from(path, "ucs2"), (0, utils_1.getFontName)(path), fontSize, {
    enableActualHeight: false,
    enableAntiAliasing: true,
    format: "rgba",
    ...options,
    color: "color" in options ? (0, utils_1.toBGR)(options.color) : 0xffffff,
    backgroundColor: "backgroundColor" in options ? (0, utils_1.toBGR)(options.backgroundColor) : 0,
});
exports.default = textToImg;
//# sourceMappingURL=textToImg.js.map