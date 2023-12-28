import { WindowInfo } from "./types";
declare const getWindowChildren: {
    (parentHandle: number): WindowInfo[];
    (parentTitle: string | null, parentClassName?: string | null): WindowInfo[];
};
export default getWindowChildren;
