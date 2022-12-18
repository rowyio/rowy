import { IDisplayCellProps } from "@src/components/fields/types";
import { useFormula } from "./useFormula";
import { getDisplayCell } from "./util";

export default function Formula(props: IDisplayCellProps) {
  const { result, error } = useFormula({
    row: props.row,
    listenerFields: props.column.config?.listenerFields || [],
    formulaFn: props.column.config?.formulaFn || "",
  });

  const type = props.column.config?.renderFieldType;
  const DisplayCell = getDisplayCell(type);

  if (error) {
    return <>Error ${error}</>;
  }

  return <DisplayCell {...props} value={result} disabled={true} />;
}
