import { useState } from "react";
import { useAtom } from "jotai";
import { doc, deleteField } from "firebase/firestore";

import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/TableCell/EditorCellTextField";

import { InputAdornment, Tooltip } from "@mui/material";
import ErrorIcon from "@mui/icons-material/ErrorOutline";

import { projectScope } from "@src/atoms/projectScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";

export default function Reference({
  value,
  ...props
}: IEditorCellProps<ReturnType<typeof doc>>) {
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);

  const [localValue, setLocalValue] = useState(
    Boolean(value) && "path" in value && typeof value.path === "string"
      ? value.path
      : ""
  );
  const [error, setError] = useState("");

  return (
    <EditorCellTextField
      {...(props as any)}
      value={localValue}
      onChange={(newValue) => {
        if (newValue !== undefined && newValue !== "") {
          try {
            const refValue = doc(firebaseDb, newValue);
            props.onChange(refValue);
            setError("");
          } catch (e: any) {
            setError(e.message);
          }
        } else {
          props.onChange(deleteField() as any);
        }

        setLocalValue(newValue);
      }}
      InputProps={{
        endAdornment: error && (
          <InputAdornment position="end" sx={{ mr: 1, cursor: "default" }}>
            <Tooltip title={error}>
              <ErrorIcon color="error" />
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
}
