import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { cloneDeep, unset, findIndex, sortBy } from "lodash-es";

import {
  tableScope,
  tableSchemaAtom,
  updateTableSchemaAtom,
  tableRowsDbAtom,
  _updateRowDbAtom,
  _deleteRowDbAtom,
  _bulkWriteDbAtom,
  addRowAtom,
} from "@src/atoms/tableScope";
import { TableSchema, TableRow, BulkWriteFunction } from "@src/types/table";
import { updateRowData } from "@src/utils/table";
import { TABLE_SCHEMAS } from "@src/config/dbPaths";

export const TUTORIAL_COLLECTION = "tutorial";
export const TUTORIAL_TABLE_SETTINGS = {
  id: TUTORIAL_COLLECTION,
  name: "Tutorial",
  collection: TUTORIAL_COLLECTION,
  roles: ["ADMIN"],
  section: "",
  tableType: "primaryCollection",
  audit: false,
};
export const TUTORIAL_TABLE_SCHEMA = {
  _rowy_ref: {
    path: TABLE_SCHEMAS + "/" + TUTORIAL_COLLECTION,
    id: TUTORIAL_COLLECTION,
  },
};

export function TableSourceTutorial() {
  const setTableSchema = useSetAtom(tableSchemaAtom, tableScope);

  const setUpdateTableSchema = useSetAtom(updateTableSchemaAtom, tableScope);
  setUpdateTableSchema(
    () => async (update: Partial<TableSchema>, deleteFields?: string[]) => {
      setTableSchema((current) => {
        const withFieldsDeleted = cloneDeep(current);
        if (Array.isArray(deleteFields)) {
          for (const field of deleteFields) {
            unset(withFieldsDeleted, field);
          }
        }
        return updateRowData(withFieldsDeleted || {}, update);
      });
    }
  );

  const setRowsDb = useSetAtom(tableRowsDbAtom, tableScope);
  const readRowsDb = useAtomCallback(
    useCallback((get) => get(tableRowsDbAtom), []),
    tableScope
  );

  const setUpdateRowDb = useSetAtom(_updateRowDbAtom, tableScope);
  setUpdateRowDb(() => (path: string, update: Partial<TableRow>) => {
    setRowsDb((_rows) => {
      const rows = [..._rows];
      const index = findIndex(rows, ["_rowy_ref.path", path]);

      // Append if not found and sort by ID
      if (index === -1) {
        return sortBy(
          [
            ...rows,
            { ...update, _rowy_ref: { id: path.split("/").pop()!, path } },
          ],
          ["_rowy_ref.id"]
        );
      }

      rows[index] = updateRowData(rows[index], update);
      return rows;
    });
    return Promise.resolve();
  });

  const setDeleteRowDb = useSetAtom(_deleteRowDbAtom, tableScope);
  setDeleteRowDb(() => async (path: string) => {
    const _rows = await readRowsDb();
    const rows = [..._rows];
    const index = findIndex(rows, ["_rowy_ref.path", path]);
    if (index > -1) {
      rows.splice(index, 1);
      setRowsDb(rows);
    }
    return Promise.resolve();
  });

  const setBulkWriteDb = useSetAtom(_bulkWriteDbAtom, tableScope);
  const addRow = useSetAtom(addRowAtom, tableScope);
  // WARNING: Only supports bulk add row for import CSV
  setBulkWriteDb(
    () =>
      (
        operations: Parameters<BulkWriteFunction>[0],
        _onBatchCommit: Parameters<BulkWriteFunction>[1]
      ) =>
        addRow({
          row: operations.map((operation) => ({
            ...(operation as any).data,
            _rowy_ref: { id: operation.path, path: operation.path },
          })),
          setId: "decrement",
        })
  );

  return null;
}
