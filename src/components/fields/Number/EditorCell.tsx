import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/TableCell/EditorCellTextField";

export default function Number_(props: IEditorCellProps<number>) {
  return (
    <EditorCellTextField
      {...(props as any)}
      InputProps={{ type: "number" }}
      onChange={(v) => props.onChange(Number(v))}
    />
  );
}
