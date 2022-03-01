import { useRef, useLayoutEffect } from "react";
import { EditorProps } from "react-data-grid";

import { TextField } from "@mui/material";

import { FieldType } from "@src/constants/fields";
import { getCellValue } from "@src/utils/fns";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { getColumnType } from "@src/components/fields";

export default function TextEditor({ row, column }: EditorProps<any>) {
  const { updateCell } = useProjectContext();

  const type = getColumnType(column as any);

  const cellValue = getCellValue(row, column.key);
  const defaultValue =
    type === FieldType.percentage && typeof cellValue === "number"
      ? cellValue * 100
      : cellValue;

  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    return () => {
      const newValue = inputRef.current?.value;
      if (newValue !== undefined && updateCell) {
        if (type === FieldType.number) {
          updateCell(row.ref, column.key, Number(newValue));
        } else if (type === FieldType.percentage) {
          updateCell(row.ref, column.key, Number(newValue) / 100);
        } else {
          updateCell(row.ref, column.key, newValue);
        }
      }
    };
  }, []);

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
