import { useEffect, useMemo, useState } from "react";
import { pick, zipObject } from "lodash-es";
import { useAtom, useSetAtom } from "jotai";

import { TableRow, TableRowRef, ColumnConfig } from "@src/types/table";
import {
  tableColumnsOrderedAtom,
  tableScope,
  updateFieldAtom,
} from "@src/atoms/tableScope";

import {
  listenerFieldTypes,
  serializeRef,
  useDeepCompareMemoize,
} from "./util";

export const useFormula = ({
  column,
  row,
  ref,
  listenerFields,
  formulaFn,
}: {
  column: ColumnConfig;
  row: TableRow;
  ref: TableRowRef;
  listenerFields: string[];
  formulaFn: string;
}) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);

  const availableColumns = tableColumnsOrdered
    .filter((c) => listenerFieldTypes.includes(c.type))
    .map((c) => c.key);

  const availableFields = useMemo(
    () => ({
      ...zipObject(
        availableColumns,
        Array(availableColumns.length).fill(undefined)
      ),
      ...pick(row, availableColumns),
    }),
    [row, availableColumns]
  );

  const listeners = useMemo(
    () => pick(availableFields, listenerFields),
    [availableFields, listenerFields]
  );

  useEffect(() => {
    setError(null);
    setLoading(true);

    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = ({ data: { result, error } }: any) => {
      worker.terminate();
      if (error) {
        setError(error);
      } else {
        setResult(result);
      }
      setLoading(false);
    };

    worker.postMessage(
      JSON.stringify({
        formulaFn,
        row: availableFields,
        ref: serializeRef(ref.path),
      })
    );

    return () => {
      worker.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDeepCompareMemoize(listeners), formulaFn]);

  const updateField = useSetAtom(updateFieldAtom, tableScope);

  useEffect(() => {
    updateField({
      path: row._rowy_ref.path,
      fieldName: `_rowy_formulaValue_${column.key}`,
      value: result,
    });
  }, [result, column.key, row._rowy_ref.path, updateField]);

  return { result, error, loading };
};
