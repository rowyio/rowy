import CircularProgressOptical from "@src/components/CircularProgressOptical";
import { IDisplayCellProps } from "@src/components/fields/types";

import { useFormula } from "./useFormula";
import { defaultFn, getDisplayCell } from "./util";

export default function Formula(props: IDisplayCellProps) {
  const { result, error, loading } = useFormula({
    column: props.column,
    row: props.row,
    ref: props._rowy_ref,
    listenerFields: props.column.config?.listenerFields || [],
    formulaFn: props.column.config?.formulaFn || defaultFn,
  });

  const type = props.column.config?.renderFieldType;
  const DisplayCell = getDisplayCell(type);

  if (error) {
    return <>Error: {error.message}</>;
  }

  if (loading) {
    return <CircularProgressOptical id="progress" size={20} sx={{ m: 0.25 }} />;
  }

  return <DisplayCell {...props} value={result} disabled={true} />;
}
