import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/TableCell/EditorCellTextField";

export default function Phone(props: IEditorCellProps<string>) {
  return <EditorCellTextField {...props} InputProps={{ type: "tel" }} />;
}
