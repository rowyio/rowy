import { renderHook } from "@testing-library/react";
import { useAtomValue, useSetAtom } from "jotai";

import {
  tableScope,
  tableFiltersAtom,
  tableSortsAtom,
  tableRowsAtom,
  tableRowsDbAtom,
  tableRowsLocalAtom,
} from "@src/atoms/tableScope";
import { TableFilter, TableRow, TableSort } from "@src/types/table";

const TEST_COLLECTION = "_testing";

const initRows = (
  initialRowsDb: TableRow[] = [],
  initialRowsLocal: TableRow[] = [],
  tableFilters: TableFilter[] = [],
  tableSorts: TableSort[] = []
) =>
  renderHook(async () => {
    const setRowsDb = useSetAtom(tableRowsDbAtom, tableScope);
    setRowsDb([...initialRowsDb]);

    const setRowsLocal = useSetAtom(tableRowsLocalAtom, tableScope);
    setRowsLocal({ type: "set", rows: [...initialRowsLocal] });

    const setTableFilters = useSetAtom(tableFiltersAtom, tableScope);
    setTableFilters([...tableFilters]);

    const setTableSorts = useSetAtom(tableSortsAtom, tableScope);
    setTableSorts([...tableSorts]);
  });

describe("tableRowsAtom", () => {
  test("excludes out-of-order local rows when filters are active, but still merges local edits", async () => {
    const rowsDb: TableRow[] = [
      { _rowy_ref: { id: "row0", path: `${TEST_COLLECTION}/row0` }, n: 0 },
      { _rowy_ref: { id: "row1", path: `${TEST_COLLECTION}/row1` }, n: 1 },
    ];
    const rowsLocal: TableRow[] = [
      {
        _rowy_ref: { id: "rowLocal0", path: `${TEST_COLLECTION}/rowLocal0` },
        _rowy_outOfOrder: true,
        localOnly: true,
      } as any,
      {
        _rowy_ref: { id: "row1", path: `${TEST_COLLECTION}/row1` },
        localOverlay: "yes",
      } as any,
    ];

    initRows(
      rowsDb,
      rowsLocal,
      [{ id: "f1", key: "n", operator: "==", value: 1 }],
      []
    );

    const {
      result: { current: tableRows },
    } = renderHook(() => useAtomValue(tableRowsAtom, tableScope));

    expect(tableRows).toHaveLength(2);
    expect(tableRows.find((r) => r._rowy_ref.id === "rowLocal0")).toBeFalsy();
    expect(tableRows.find((r) => r._rowy_ref.id === "row1")?.localOverlay).toBe(
      "yes"
    );
  });

  test("includes out-of-order local rows when no filters or sorts are active", async () => {
    const rowsDb: TableRow[] = [
      { _rowy_ref: { id: "row0", path: `${TEST_COLLECTION}/row0` }, n: 0 },
      { _rowy_ref: { id: "row1", path: `${TEST_COLLECTION}/row1` }, n: 1 },
    ];
    const rowsLocal: TableRow[] = [
      {
        _rowy_ref: { id: "rowLocal0", path: `${TEST_COLLECTION}/rowLocal0` },
        _rowy_outOfOrder: true,
        localOnly: true,
      } as any,
      {
        _rowy_ref: { id: "row1", path: `${TEST_COLLECTION}/row1` },
        localOverlay: "yes",
      } as any,
    ];

    initRows(rowsDb, rowsLocal, [], []);

    const {
      result: { current: tableRows },
    } = renderHook(() => useAtomValue(tableRowsAtom, tableScope));

    expect(tableRows.find((r) => r._rowy_ref.id === "rowLocal0")).toBeTruthy();
    expect(tableRows.find((r) => r._rowy_ref.id === "row1")?.localOverlay).toBe(
      "yes"
    );
  });
});

