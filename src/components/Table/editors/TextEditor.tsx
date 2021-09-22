import { useRef, useLayoutEffect } from "react";
import { EditorProps } from "react-data-grid";

import { makeStyles, createStyles } from "@mui/styles";
import { TextField } from "@mui/material";

import { FieldType } from "constants/fields";
import { getCellValue } from "utils/fns";
import { useProjectContext } from "contexts/ProjectContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      backgroundColor: "var(--background-color)",
    },

    inputBase: {
      height: "100%",
      font: "inherit", // Prevent text jumping
      letterSpacing: "inherit", // Prevent text jumping
    },
    input: {
      font: "inherit", // Prevent text jumping
      letterSpacing: "inherit", // Prevent text jumping
      padding: "var(--cell-padding)",
    },
  })
);

export default function TextEditor({ row, column }: EditorProps<any>) {
  const { updateCell } = useProjectContext();
  const classes = useStyles();

  const type = (column as any).config?.renderFieldType ?? (column as any).type;

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
        if (type === FieldType.number || type === FieldType.percentage) {
          updateCell(row.ref, column.key, Number(newValue));
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
      variant="standard"
      inputProps={{
        ref: inputRef,
        maxLength: maxLength,
      }}
      className={classes.root}
      InputProps={{
        classes: { root: classes.inputBase, input: classes.input },
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
