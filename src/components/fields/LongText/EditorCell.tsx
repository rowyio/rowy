import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/EditorCellTextField";

export default function LongText(props: IEditorCellProps<string>) {
  return <EditorCellTextField {...props} InputProps={{ multiline: true }} />;
}
