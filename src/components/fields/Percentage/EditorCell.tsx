import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/TableCell/EditorCellTextField";
import { multiply100WithPrecision, divide100WithPrecision } from "./utils";

export default function Percentage(props: IEditorCellProps<number>) {
  return (
    <EditorCellTextField
      {...(props as any)}
      InputProps={{ type: "number", endAdornment: "%" }}
      value={
        typeof props.value === "number"
          ? multiply100WithPrecision(props.value)
          : props.value
      }
      onChange={(v) => {
        props.onChange(divide100WithPrecision(Number(v)));
      }}
    />
  );
}
