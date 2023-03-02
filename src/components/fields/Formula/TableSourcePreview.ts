import { useCallback, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { cloneDeep, findIndex, sortBy } from "lodash-es";

import {
  _deleteRowDbAtom,
  _updateRowDbAtom,
  tableNextPageAtom,
  tableRowsDbAtom,
  tableSchemaAtom,
  tableScope,
  tableSettingsAtom,
} from "@src/atoms/tableScope";

import { TableRow, TableSchema } from "@src/types/table";
import { updateRowData } from "@src/utils/table";
import { serializeRef } from "./util";

const TableSourcePreview = ({ tableSchema }: { tableSchema: TableSchema }) => {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const setTableSchemaAtom = useSetAtom(tableSchemaAtom, tableScope);
  const setRows = useSetAtom(tableRowsDbAtom, tableScope);
  useEffect(() => {
    setRows(
      ["preview-doc-1", "preview-doc-2", "preview-doc-3"].map((docId) => ({
        _rowy_ref: serializeRef(`${tableSettings.collection}/${docId}`),
      }))
    );
  }, [setRows, tableSettings.collection]);

  useEffect(() => {
    setTableSchemaAtom(() => ({
      ...tableSchema,
      _rowy_ref: "preview",
    }));
  }, [tableSchema, setTableSchemaAtom]);

  const readRowsDb = useAtomCallback(
    useCallback((get) => get(tableRowsDbAtom) || [], []),
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
