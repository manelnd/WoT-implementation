import { Keyboard, Mouse, Workwindow } from "./types";
declare class Worker {
    /** Provides methods to synthesize keystrokes */
    readonly keyboard: Keyboard;
    /** Provides methods to synthesize mouse motions, and button clicks */
    readonly mouse: Mouse;
    /** Provides methods to work with workwindow */
    readonly workwindow: Workwindow;
    /** Use entire desktop as workwindow */
    constructor();
    /** Use the first window with {@link handle} */
    constructor(handle: number);
    /** Use the first window with {@link title} and/or {@link className} and sets it as current workwindow */
    constructor(title: string | null, className?: string | null);
    /** Use the first child window with {@link childClassName} and/or {@link childTitle} of window with {@link parentHandle} and sets it as current workwindow */
    constructor(parentHandle: number, childClassName: string | null, childTitle?: string | null);
    /** Use the first child window with {@link childClassName} and/or {@link childTitle} of the first found window with {@link parentTitle} and/or {@link parentClassName} and sets it as current workwindow */
    constructor(parentTitle: string | null, parentClassName: string | null, childClassName: string | null, childTitle?: string | null);
}
/** Provides methods implementations on hardware level. */
export declare const Hardware: typeof Worker;
/** Provides methods implementations on virtual level. */
export declare const Virtual: typeof Worker;
export {};
