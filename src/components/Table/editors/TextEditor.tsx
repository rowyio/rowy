import { useRef, useLayoutEffect } from "react";
import { EditorProps } from "react-data-grid";
import { useSetAtom } from "jotai";
import { get } from "lodash-es";

import { TextField } from "@mui/material";

import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldType } from "@src/components/fields";

/** WARNING: THIS DOES NOT WORK IN REACT 18 STRICT MODE */
export default function TextEditor({ row, column }: EditorProps<any>) {
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const type = getFieldType(column as any);

  const cellValue = get(row, column.key);
  const defaultValue =
    type === FieldType.percentage && typeof cellValue === "number"
      ? cellValue * 100
      : cellValue;

  const inputRef = useRef<HTMLInputElement>(null);

  // WARNING: THIS DOES NOT WORK IN REACT 18 STRICT MODE
  useLayoutEffect(() => {
    const inputElement = inputRef.current;
    return () => {
      const newValue = inputElement?.value;
      let formattedValue: any = newValue;
      if (newValue !== undefined) {
        if (type === FieldType.number) {
          formattedValue = Number(newValue);
        } else if (type === FieldType.percentage) {
          formattedValue = Number(newValue) / 100;
        }

        updateField({
          path: row._rowy_ref.path,
          fieldName: column.key,
          value: formattedValue,
        });
      }
    };
  }, [column.key, row._rowy_ref.path, type, updateField]);

  let inputType = "text";
  switch (type) {
    case FieldType.email:
      inputType = "email";
      break;
    case FieldType.phone:
      inputType = "tel";
      break;
    case FieldType.url:
      inputType = "url";
      break;
    case FieldType.number:
    case FieldType.percentage:
      inputType = "number";
      break;

    default:
      break;
  }

  const { maxLength } = (column as any).config;

  return (
    <TextField
      defaultValue={defaultValue}
      type={inputType}
      fullWidth
      multiline={type === FieldType.longText}
      variant="standard"
      inputProps={{
        ref: inputRef,
        maxLength: maxLength,
      }}
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "var(--cell-background-color)",

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
      InputProps={{
        endAdornment:
          (column as any).type === FieldType.percentage ? "%" : undefined,
      }}
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
