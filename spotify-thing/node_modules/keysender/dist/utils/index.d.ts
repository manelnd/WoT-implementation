/// <reference types="node" />
import { Delay, RGB, WindowInfo } from "../types";
import { _WindowInfo } from "../addon";
import { CancelableFunction, SetThisParameter } from "../types/utils";
export declare const random: (min: number, max: number) => number;
export declare const sleep: (delay: Delay) => Promise<void>;
type StringsToBuffers<T extends any[]> = {
    [key in keyof T]: Extract<T[key], string> extends string ? Exclude<T[key], string> | Buffer : T[key];
};
export declare const stringsToBuffers: <T extends any[]>(args: T) => StringsToBuffers<T>;
export declare const lazyGetters: <T extends {}, K extends keyof T>(self: T, modules: { [key in K]: () => T[key]; }) => void;
export declare const bindPick: <T extends {}, K extends keyof T>(worker: T, keys: K[]) => { [key in K]: T[key] extends Function ? T[key] : never; };
export declare const noop: () => void;
export declare const toBGR: (color: number | string | RGB) => number;
export declare const getFontName: (path: string) => Buffer;
export declare const normalizeWindowInfo: (windowInfo: _WindowInfo) => WindowInfo;
type CancelRef = {
    isCanceled(): true | void;
    isCancelable?: true;
};
export declare const makeCancelable: <Fn extends (...args: any[]) => any>(fn: SetThisParameter<CancelRef, Fn>) => CancelableFunction<Fn>;
export {};
