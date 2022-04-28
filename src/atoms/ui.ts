import { atomWithStorage } from "jotai/utils";

/** Nav open state stored in local storage. */
export const navOpenAtom = atomWithStorage("__ROWY__NAV_OPEN", false);
/** Nav pinned state stored in local storage. */
export const navPinnedAtom = atomWithStorage("__ROWY__NAV_PINNED", false);
