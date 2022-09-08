import { useRef, useLayoutEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { EditorProps } from "react-data-grid";
import { get } from "lodash-es";

import { TextField } from "@mui/material";

import { projectScope } from "@src/atoms/projectScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import { doc, deleteField } from "firebase/firestore";

/** WARNING: THIS DOES NOT WORK IN REACT 18 STRICT MODE */
export default function TextEditor({ row, column }: EditorProps<any>) {
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const inputRef = useRef<HTMLInputElement>(null);

  // WARNING: THIS DOES NOT WORK IN REACT 18 STRICT MODE
  useLayoutEffect(() => {
    const inputElement = inputRef.current;
    return () => {
      const newValue = inputElement?.value;
      if (newValue !== undefined && newValue !== "") {
        updateField({
          path: row._rowy_ref.path,
          fieldName: column.key,
          value: doc(firebaseDb, newValue),
        });
      } else {
        updateField({
          path: row._rowy_ref.path,
          fieldName: column.key,
          value: deleteField(),
        });
      }
    };
  }, [column.key, row._rowy_ref.path, updateField]);

  const defaultValue = get(row, column.key)?.path ?? "";
  const { maxLength } = (column as any).config;

  return (
    <TextField
      defaultValue={defaultValue}
      fullWidth
      variant="standard"
      inputProps={{
        ref: inputRef,
        maxLength: maxLength,
      }}
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "var(--background-color)",

        "& .MuiInputBase-root": {
          height: "100%",
          font: "inherit", // Prevent text jumping
          letterSpacing: "inherit", // Prevent text jumping
          p: 0,
        },
        "& .MuiInputBase-input": {
          height: "100%",
          font: "inherit", // Prevent text jumping
          letterSpacing: "inherit", // Prevent text jumping
          p: "var(--cell-padding)",
          pb: 1 / 8,
        },
        "& textarea.MuiInputBase-input": {
          lineHeight: (theme) => theme.typography.body2.lineHeight,
          maxHeight: "100%",
          boxSizing: "border-box",
          py: 3 / 8,
        },
      }}
      // InputProps={{
      //   endAdornment:
      //     (column as any).type === FieldType.percentage ? "%" : undefined,
      // }}
      autoFocus
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.stopPropagation();
        }

        if (e.key === "Escape") {
          (e.target as any).value = defaultValue;
        }
      }}
    />
  );
}
