import { tableColumnsOrderedAtom, tableScope } from "@src/atoms/tableScope";
import { TableRow } from "@src/types/table";
import { useAtom } from "jotai";
import { pick, zipObject } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { useDeepCompareMemoize } from "./util";

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

  const availableColumns = tableColumnsOrdered.map((c) => c.key);

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
    setLoading(true);

    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "classic",
    });
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
      row: availableFields,
    });

    return () => {
      worker.terminate();
      clearInterval(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDeepCompareMemoize(availableFields), formulaFn]);

  return { result, error, loading };
};
