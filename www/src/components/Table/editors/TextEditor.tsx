import React, { useRef, useEffect } from "react";
import { EditorProps } from "react-data-grid";

import { makeStyles, createStyles, TextField } from "@material-ui/core";

import { FieldType } from "constants/fields";
import { getCellValue } from "utils/fns";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: theme.spacing(0, -1.5),
      width: `calc(100% + ${theme.spacing(1.5) * 2}px)`,
      height: "100%",

      backgroundColor:
        theme.palette.background.elevation?.[8] ??
        theme.palette.background.paper,
    },

    inputBase: {
      padding: theme.spacing(0, 1.5),
      height: "100%",
      font: "inherit",
      letterSpacing: "inherit", // Prevent text jumping
    },
    input: {
      paddingBottom: theme.spacing(0.75), // Align baselines
      letterSpacing: "inherit", // Prevent text jumping
      height: "100%", // Stop text clipping
    },
  })
);

export default function TextEditor({ row, column }: EditorProps<any>) {
  const classes = useStyles();

  const cellValue = getCellValue(row, column.key);
  const defaultValue =
    (column as any).type === FieldType.percentage &&
    typeof cellValue === "number"
      ? cellValue * 100
      : cellValue;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      const newValue = inputRef.current?.value;
      if (newValue !== undefined) {
        if (
          (column as any).type === FieldType.number ||
          (column as any).type === FieldType.percentage
        ) {
          row.ref.update({ [column.key]: Number(newValue) });
        } else {
          row.ref.update({ [column.key]: newValue });
        }
      }
    };
  }, []);

  let inputType = "text";
  switch ((column as any).type) {
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
