import { useRef } from "react";
import { EditorProps } from "react-data-grid";

import { TextField } from "@mui/material";

import { FieldType } from "@src/constants/fields";
import { getCellValue } from "@src/utils/fns";
import { useProjectContext } from "@src/contexts/ProjectContext";
import useOnClickOutside from "@src/hooks/useOnClickOutside";

export default function TextEditor({ row, column }: EditorProps<any>) {
  const defaultValue = getCellValue(row, column.key);

  const { updateCell } = useProjectContext();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUpdateCell() {
    const newValue = inputRef.current?.value;
    if (newValue === defaultValue) return;
    updateCell?.(row.ref, column.key, newValue);
  }
  /**
   *  react-data-grid always unmounts and remounts this component, when user hits enter or escape
   *  if user clicks outside the cell, update the cell with current value
   */
  useOnClickOutside(inputRef, () => handleUpdateCell());

  const type = (column as any).config?.renderFieldType ?? (column as any).type;
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
    default:
      break;
  }

  const { maxLength } = (column as any).config;
  return (
    <TextField
      onBeforeInput={(e) => e.target}
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
      autoFocus
      onKeyDown={(e: any) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.stopPropagation();
        }
        if (e.key === "Enter") {
          handleUpdateCell();
        }
      }}
    />
  );
}
