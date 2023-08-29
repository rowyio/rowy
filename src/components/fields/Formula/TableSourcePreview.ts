import { useCallback, useEffect, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { cloneDeep, findIndex, isEqual, sortBy } from "lodash-es";

import {
  _deleteRowDbAtom,
  _updateRowDbAtom,
  tableNextPageAtom,
  tableRowsAtom,
  tableRowsDbAtom,
  tableRowsLocalAtom,
  tableScope,
  tableSettingsAtom,
} from "@src/atoms/tableScope";

import { TableRow } from "@src/types/table";
import { generateId, updateRowData } from "@src/utils/table";
import { serializeRef } from "./util";

const TableSourcePreview = ({ formulaFn }: { formulaFn: string }) => {
  const prevFn = useRef(formulaFn);
  const isInitialMount = useRef(true);

  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [rows, setRows] = useAtom(tableRowsDbAtom, tableScope);
  const setUpdateRowDb = useSetAtom(_updateRowDbAtom, tableScope);
  const setDeleteRowDb = useSetAtom(_deleteRowDbAtom, tableScope);
  const setNextPageAtom = useSetAtom(tableNextPageAtom, tableScope);

  const generateRows = useCallback(
    (rows: TableRow[]) =>
      rows.map((row) => ({
        ...row,
        _rowy_ref: serializeRef(`${tableSettings.collection}/${generateId()}`),
      })),
    [tableSettings.collection]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const emptyRow = {} as TableRow;
      setRows(generateRows([emptyRow, emptyRow, emptyRow]));
    }
  }, [setRows, generateRows, tableSettings.collection]);

  useEffect(() => {
    if (!isEqual(prevFn.current, formulaFn)) {
      prevFn.current = formulaFn;
      setRows(rows.map((row) => ({ ...row, __mock_field__: Math.random() })));
    }
  }, [rows, setRows, generateRows, formulaFn]);

  useEffect(() => {
    setUpdateRowDb(() => (path: string, update: Partial<TableRow>) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRows, setUpdateRowDb]);

  useEffect(() => {
    setDeleteRowDb(() => (path: string) => {
      const index = findIndex(rows, ["_rowy_ref.path", path]);
      if (index > -1) {
        setRows(rows.filter((_, idx) => idx !== index));
      }
      return Promise.resolve();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRows, setDeleteRowDb]);

  useEffect(() => {
    setNextPageAtom({ loading: false, available: false });
  }, [setNextPageAtom]);

  return null;
};

export default TableSourcePreview;
