import { atom } from "jotai";

/** Store side drawer open state */
export const sideDrawerOpenAtom = atom(false);

/** Store selected cell for side drawer */
export const sideDrawerSelectedCellAtom = atom<{
  path: string;
  columnKey: string;
} | null>(null);
