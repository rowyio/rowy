import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { cloneDeep, findIndex, sortBy } from "lodash-es";

import {
  _deleteRowDbAtom,
  _updateRowDbAtom,
  tableNextPageAtom,
  tableRowsDbAtom,
  tableSchemaAtom,
  tableScope,
} from "@src/atoms/tableScope";

import { TableRow, TableSchema } from "@src/types/table";
import { updateRowData } from "@src/utils/table";

const TableSourcePreview = ({ tableSchema }: { tableSchema: TableSchema }) => {
  const setTableSchemaAtom = useSetAtom(tableSchemaAtom, tableScope);
  setTableSchemaAtom(() => ({
    ...tableSchema,
    _rowy_ref: "preview",
  }));

  const setRows = useSetAtom(tableRowsDbAtom, tableScope);
  const readRowsDb = useAtomCallback(
    useCallback((get) => get(tableRowsDbAtom), []),
    tableScope
  );

  const setUpdateRowDb = useSetAtom(_updateRowDbAtom, tableScope);
  setUpdateRowDb(() => async (path: string, update: Partial<TableRow>) => {
    const rows = await readRowsDb();
    const index = findIndex(rows, ["_rowy_ref.path", path]);
    if (index === -1) {
      setRows(
        sortBy(
          [
            ...rows,
            { ...update, _rowy_ref: { id: path.split("/").pop()!, path } },
          ],
          ["_rowy_ref.id"]
        )
      );
    } else {
      const updatedRows = [...rows];
      updatedRows[index] = cloneDeep(rows[index]);
      updatedRows[index] = updateRowData(updatedRows[index], update);
      setRows(updatedRows);
    }
    return Promise.resolve();
  });

  const setDeleteRowDb = useSetAtom(_deleteRowDbAtom, tableScope);
  setDeleteRowDb(() => async (path: string) => {
    const rows = await readRowsDb();
    const index = findIndex(rows, ["_rowy_ref.path", path]);
    if (index > -1) {
      setRows(rows.filter((_, idx) => idx !== index));
    }
    return Promise.resolve();
  });

  const setNextPageAtom = useSetAtom(tableNextPageAtom, tableScope);
  setNextPageAtom({ loading: false, available: false });

  return null;
};

export default TableSourcePreview;
