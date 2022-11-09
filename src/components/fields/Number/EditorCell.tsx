import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/EditorCellTextField";

export default function Number_(props: IEditorCellProps<number>) {
  return (
    <EditorCellTextField
      {...(props as any)}
      InputProps={{ type: "number" }}
      onSubmit={(v) => props.onSubmit(Number(v))}
    />
  );
}
