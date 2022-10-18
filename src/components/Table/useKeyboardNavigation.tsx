import { useState } from "react";
import { useSetAtom } from "jotai";
import { ColumnDef } from "@tanstack/react-table";

import { tableScope, selectedCellAtom } from "@src/atoms/tableScope";
import { TableRow } from "@src/types/table";
import { COLLECTION_PAGE_SIZE } from "@src/config/db";

export interface IUseKeyboardNavigationProps {
  gridRef: React.RefObject<HTMLDivElement>;
  tableRows: TableRow[];
  columns: ColumnDef<TableRow, any>[];
}

export function useKeyboardNavigation({
  gridRef,
  tableRows,
  columns,
}: IUseKeyboardNavigationProps) {
  const setSelectedCell = useSetAtom(selectedCellAtom, tableScope);
  const [focusInsideCell, setFocusInsideCell] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Block default browser behavior for arrow keys (scroll) and other keys
    const LISTENED_KEYS = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Enter",
      "Escape",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ];
    if (LISTENED_KEYS.includes(e.key)) e.preventDefault();

    // Esc: exit cell
    if (e.key === "Escape") {
      setFocusInsideCell(false);
      (
        gridRef.current?.querySelector("[aria-selected=true]") as HTMLDivElement
      )?.focus();
      return;
    }

    // If event target is not a cell, ignore
    const target = e.target as HTMLDivElement;
    if (
      target.getAttribute("role") !== "columnheader" &&
      target.getAttribute("role") !== "gridcell"
    )
      return;

    // Enter: enter cell
    if (e.key === "Enter") {
      setFocusInsideCell(true);
      (target.querySelector("[tabindex]") as HTMLElement)?.focus();
      return;
    }

    const colIndex = Number(target.getAttribute("aria-colindex")) - 1;
    const rowIndex =
      Number(target.parentElement!.getAttribute("aria-rowindex")) - 2;

    let newColIndex = colIndex;
    let newRowIndex = rowIndex;

    switch (e.key) {
      case "ArrowUp":
        if (e.ctrlKey || e.metaKey) newRowIndex = -1;
        else if (rowIndex > -1) newRowIndex = rowIndex - 1;
        break;

      case "ArrowDown":
        if (e.ctrlKey || e.metaKey) newRowIndex = tableRows.length - 1;
        else if (rowIndex < tableRows.length - 1) newRowIndex = rowIndex + 1;
        break;

      case "ArrowLeft":
        if (e.ctrlKey || e.metaKey) newColIndex = 0;
        else if (colIndex > 0) newColIndex = colIndex - 1;
        break;

      case "ArrowRight":
        if (e.ctrlKey || e.metaKey) newColIndex = columns.length - 1;
        else if (colIndex < columns.length - 1) newColIndex = colIndex + 1;
        break;

      case "PageUp":
        newRowIndex = Math.max(0, rowIndex - COLLECTION_PAGE_SIZE);
        break;

      case "PageDown":
        newRowIndex = Math.min(
          tableRows.length - 1,
          rowIndex + COLLECTION_PAGE_SIZE
        );
        break;

      case "Home":
        newColIndex = 0;
        if (e.ctrlKey || e.metaKey) newRowIndex = -1;
        break;

      case "End":
        newColIndex = columns.length - 1;
        if (e.ctrlKey || e.metaKey) newRowIndex = tableRows.length - 1;
        break;
    }

    // Get `path` and `columnKey` from `tableRows` and `columns` respectively
    const newSelectedCell = {
      path:
        newRowIndex > -1
          ? tableRows[newRowIndex]._rowy_ref.path
          : "_rowy_header",
      columnKey: columns[newColIndex].id! || columns[0].id!,
    };

    // Store in selectedCellAtom
    setSelectedCell(newSelectedCell);

    // Find matching DOM element for the cell
    const newCellEl = gridRef.current?.querySelector(
      `[aria-rowindex="${newRowIndex + 2}"] [aria-colindex="${
        newColIndex + 1
      }"]`
    );

    // Focus the cell
    if (newCellEl) setTimeout(() => (newCellEl as HTMLDivElement).focus());

    // When selected cell changes, exit current cell
    setFocusInsideCell(false);
  };

  return { handleKeyDown, focusInsideCell } as const;
}
