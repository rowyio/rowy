import { tableColumnsOrderedAtom, tableScope } from "@src/atoms/tableScope";
import { TableRow } from "@src/types/table";
import { useAtom } from "jotai";
import { pick, zipObject } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { ignoredColumns, useDeepCompareMemoize } from "./util";

export const useFormula = ({
  row,
  formulaFn,
}: {
  row: TableRow;
  formulaFn: string;
}) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);

  const availableColumns = tableColumnsOrdered
    .filter((column) => !ignoredColumns.includes(column.type))
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

  useEffect(() => {
    console.log("useFormula calculation: ", row._rowy_ref.path);
    console.log("availableFields: ", availableFields);
    setLoading(true);

    const worker = new Worker(new URL("./worker.ts", import.meta.url));
    const timeout = setTimeout(() => {
      setError(new Error("Timeout"));
      setLoading(false);
      worker.terminate();
    }, 1000);

    worker.onmessage = ({ data: { result, error } }: any) => {
      worker.terminate();
      if (error) {
        setError(error);
      } else {
        setResult(result);
      }
      setLoading(false);
      clearInterval(timeout);
    };

    worker.postMessage({
      formulaFn: formulaFn,
      fields: availableFields,
    });

    return () => {
      worker.terminate();
      clearInterval(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDeepCompareMemoize(availableFields), formulaFn]);

  return { result, error, loading };
};
