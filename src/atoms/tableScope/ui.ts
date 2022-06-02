import { atom } from "jotai";

/** Store side drawer open state */
export const sideDrawerOpenAtom = atom(false);

/** Store selected cell in table */
export const selectedCellAtom = atom<{
  path: string;
  columnKey: string;
} | null>(null);
