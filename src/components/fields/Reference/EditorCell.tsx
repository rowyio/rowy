import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/EditorCellTextField";

import { useAtom } from "jotai";
import { doc, deleteField } from "firebase/firestore";
import { useSnackbar } from "notistack";

import { projectScope } from "@src/atoms/projectScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";

export default function Reference(
  props: IEditorCellProps<ReturnType<typeof doc>>
) {
  const { enqueueSnackbar } = useSnackbar();
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);

  return (
    <EditorCellTextField
      {...(props as any)}
      value={props.value?.path ?? ""}
      onSubmit={(newValue) => {
        if (newValue !== undefined && newValue !== "") {
          try {
            const refValue = doc(firebaseDb, newValue);
            props.onSubmit(refValue);
          } catch (e: any) {
            enqueueSnackbar(`Invalid path: ${e.message}`, { variant: "error" });
          }
        } else {
          props.onSubmit(deleteField() as any);
        }
      }}
    />
  );
}
