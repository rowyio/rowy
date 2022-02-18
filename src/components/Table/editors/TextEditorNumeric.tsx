import { useRef } from "react";
import { EditorProps } from "react-data-grid";

import { TextField } from "@mui/material";

import { FieldType } from "@src/constants/fields";
import { getCellValue } from "@src/utils/fns";
import { useProjectContext } from "@src/contexts/ProjectContext";
import useOnClickOutside from "@src/hooks/useOnClickOutside";

export default function TextEditorNumeric({ row, column }: EditorProps<any>) {
  const { updateCell } = useProjectContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const type = (column as any).config?.renderFieldType ?? (column as any).type;
  const cellValue = getCellValue(row, column.key);
  const defaultValue =
    type === FieldType.percentage && typeof cellValue === "number"
      ? cellValue * 100
      : cellValue;

  function handleUpdateCell() {
    //inputRef saves inputValues of string, covert to save properly for firebase
    const newValue = Number(inputRef.current?.value);

    if (newValue === defaultValue) return;
    type === FieldType.number
      ? updateCell?.(row.ref, column.key, newValue)
      : updateCell?.(row.ref, column.key, newValue / 100);
  }

  useOnClickOutside(inputRef, () => handleUpdateCell());
  const { maxLength } = (column as any).config;

  return (
    <TextField
      defaultValue={defaultValue}
      type={"number"}
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
        if (e.key === "Enter") {
          //When Enter is input, RDG unmounts editor. Update Cell before unmounting
          handleUpdateCell();
        }
      }}
    />
  );
}
