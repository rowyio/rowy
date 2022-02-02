import { atomWithReset } from "jotai/utils";

export type SelectedCell = {
  rowIndex: number;
  colIndex: number;
};

export interface IContextMenuAtom {
  selectedCell: SelectedCell | null;
  anchorEl: HTMLElement | null;
}

const INIT_VALUE = {
  selectedCell: null,
  anchorEl: null,
};

export const contextMenuAtom = atomWithReset<IContextMenuAtom>(INIT_VALUE);
