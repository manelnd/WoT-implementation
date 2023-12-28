import { TextToImgOptions } from "./types";
/**
 * Draws text using the specified font `(supports .ttf and .otf only)`
 * @param text - text to draw
 * @param path - path to font
 * @param fontSize - font size in px
 */
declare const textToImg: (text: string, path: string, fontSize: number, options?: TextToImgOptions) => import("./types").Image;
export default textToImg;
