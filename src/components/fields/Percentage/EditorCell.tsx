import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/EditorCellTextField";

export default function Percentage(props: IEditorCellProps<number>) {
  return (
    <EditorCellTextField
      {...(props as any)}
      InputProps={{ type: "number", endAdornment: "%" }}
      value={typeof props.value === "number" ? props.value * 100 : props.value}
      onChange={(v) => props.onChange(Number(v) / 100)}
    />
  );
}
