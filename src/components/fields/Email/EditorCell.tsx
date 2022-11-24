import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/TableCell/EditorCellTextField";

export default function Email(props: IEditorCellProps<string>) {
  return <EditorCellTextField {...props} InputProps={{ type: "email" }} />;
}
