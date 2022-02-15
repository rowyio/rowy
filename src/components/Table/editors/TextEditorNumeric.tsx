import { useRef, useLayoutEffect } from "react";
import { EditorProps } from "react-data-grid";

import { TextField } from "@mui/material";

import { FieldType } from "@src/constants/fields";
import { getCellValue } from "@src/utils/fns";
import { useProjectContext } from "@src/contexts/ProjectContext";

export default function TextEditorNumeric({ row, column }: EditorProps<any>) {
  const type = (column as any).config?.renderFieldType ?? (column as any).type;
  const cellValue = getCellValue(row, column.key);
  const defaultValue =
    type === FieldType.percentage && typeof cellValue === "number"
      ? cellValue * 100
      : cellValue;

  /**
   *    react-data-grid always unmounts and remounts this component, when user hits enter or ecape
   *    this saves the value when this TextEditor component is unmounted, which occurs when the user hits enter or escape.
   */
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateCell } = useProjectContext();
  useLayoutEffect(() => {
    return () => {
      const newValue = inputRef.current?.value;
      if (newValue !== undefined && updateCell) {
        if (type === FieldType.number) {
          updateCell(row.ref, column.key, Number(newValue));
        } else {
          //type is percentage
          updateCell(row.ref, column.key, Number(newValue) / 100);
        }
      }
    };
  }, []);

  const { maxLength } = (column as any).config;
  const inputType = "number";
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
