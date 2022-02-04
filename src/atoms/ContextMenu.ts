import { useAtom } from "jotai";
import { atomWithReset, useResetAtom, useUpdateAtom } from "jotai/utils";

export type SelectedCell = {
  rowIndex: number;
  colIndex: number;
};

export type anchorEl = HTMLElement;

const selectedCellAtom = atomWithReset<SelectedCell | null>(null);
const anchorEleAtom = atomWithReset<HTMLElement | null>(null);

export function useSetAnchorEle() {
  const setAnchorEle = useUpdateAtom(anchorEleAtom);
  return { setAnchorEle };
}

export function useSetSelectedCell() {
  const setSelectedCell = useUpdateAtom(selectedCellAtom);
  return { setSelectedCell };
}

export function useContextMenuAtom() {
  const [anchorEle] = useAtom(anchorEleAtom);
  const [selectedCell] = useAtom(selectedCellAtom);
  const resetAnchorEle = useResetAtom(anchorEleAtom);
  const resetSelectedCell = useResetAtom(selectedCellAtom);

  const resetContextMenu = async () => {
    await resetAnchorEle();
    await resetSelectedCell();
  };

  return {
    anchorEle,
    selectedCell,
    resetContextMenu,
  };
}
