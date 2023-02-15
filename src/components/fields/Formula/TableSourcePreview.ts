import { useCallback, useEffect } from "react";
import { useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { cloneDeep, findIndex, initial, sortBy } from "lodash-es";

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

const initialRows = [
  {
    _rowy_ref: {
      id: "zzzzzzzzzzzzzzzzzzzw",
      path: "preview-collection/zzzzzzzzzzzzzzzzzzzw",
    },
  },
  {
    _rowy_ref: {
      id: "zzzzzzzzzzzzzzzzzzzx",
      path: "preview-collection/zzzzzzzzzzzzzzzzzzzx",
    },
  },
  {
    _rowy_ref: {
      id: "zzzzzzzzzzzzzzzzzzzy",
      path: "preview-collection/zzzzzzzzzzzzzzzzzzzy",
    },
  },
];

const TableSourcePreview = ({ tableSchema }: { tableSchema: TableSchema }) => {
  const setTableSchemaAtom = useSetAtom(tableSchemaAtom, tableScope);
  const setRows = useSetAtom(tableRowsDbAtom, tableScope);

  useEffect(() => {
    setRows(initialRows);
  }, [setRows]);

  useEffect(() => {
    setTableSchemaAtom(() => ({
      ...tableSchema,
      _rowy_ref: "preview",
    }));
  }, [tableSchema, setTableSchemaAtom]);

  const readRowsDb = useAtomCallback(
    useCallback((get) => get(tableRowsDbAtom) || initialRows, []),
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
