import { Device, _Hook } from "./addon";
import { Reason } from "./constants";
import { KeyboardButton, MouseButton } from "./types";
import { Hotkey, HotkeyOptions } from "./utils/handleAction";
export type LowLevelHookOptions<S, R> = ({
    device: "keyboard";
    button: KeyboardButton | number;
} | {
    device: "mouse";
    button: MouseButton;
}) & HotkeyOptions<LowLevelHook<S, R>, S, R>;
declare class LowLevelHook<S = never, R = never> extends _Hook implements Hotkey<S, R> {
    state: S;
    isRunning: boolean;
    stop: (reason?: Reason.BY_STOP | R) => Promise<void> | undefined;
    constructor(options: LowLevelHookOptions<S, R>);
    /**
     * adds {@link listener} for given {@link device}, {@link button} and {@link state}
     * @param state
     * * if {@link button} is `"wheel"`: `true` for wheel going forward, `false` for wheel going back,
     * * overwise: `true` for {@link button} press, `false` for {@link button} release
     * @returns unlisten method
     */
    static on<D extends Device>(device: D, button: D extends "mouse" ? MouseButton | "wheel" : KeyboardButton | number, state: boolean, listener: () => void): () => void;
}
export default LowLevelHook;
