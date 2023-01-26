import { IEditorCellProps } from "@src/components/fields/types";
import UserSelect from "./UserSelect";

export default function EditorCell({ ...props }: IEditorCellProps) {
  return <UserSelect {...props} />;
}
