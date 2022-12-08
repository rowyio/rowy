import { tableColumnsOrderedAtom, tableScope } from "@src/atoms/tableScope";
import { TableRow } from "@src/types/table";
import { useAtom } from "jotai";
import { pick, zipObject } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { listenerFieldTypes, useDeepCompareMemoize } from "./util";

export const useFormula = ({
  row,
  listenerFields,
  formulaFn,
}: {
  row: TableRow;
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
    setLoading(true);

    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    const timeout = setTimeout(() => {
      setError(new Error("Timeout"));
      setLoading(false);
      worker.terminate();
    }, 10000);

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

    const functionBody = formulaFn.replace(/^.*=>\s*{/, "").replace(/}$/, "");
    worker.postMessage({
      formulaFn: functionBody,
      row: availableFields,
    });

    return () => {
      worker.terminate();
      clearInterval(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDeepCompareMemoize(listeners), formulaFn]);

  return { result, error, loading };
};
