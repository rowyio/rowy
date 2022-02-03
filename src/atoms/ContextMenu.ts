import { useAtom } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";

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

export default function useContextMenuAtom() {
  const [contextMenu, setContextMenu] = useAtom(contextMenuAtom);
  const resetContextMenu = useResetAtom(contextMenuAtom);

  return {
    contextMenu,
    setContextMenu,
    resetContextMenu,
  };
}

export const contextMenuAtom = atomWithReset<IContextMenuAtom>(INIT_VALUE);
