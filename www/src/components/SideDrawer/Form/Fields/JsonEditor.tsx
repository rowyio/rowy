import React from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";
import ReactJson from "react-json-view";

import { makeStyles, createStyles, useTheme } from "@material-ui/core";

import { MONO_FONT } from "Theme";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2),

      margin: 0,
      width: "100%",
      minHeight: 56,
      overflowX: "auto",
    },
  })
);

const isValidJson = (val: any) => {
  try {
    if (typeof val === "string") JSON.parse(val);
    else JSON.stringify(val);
  } catch (error) {
    return false;
  }
  return true;
};

export default function JsonEditor({ control, name }: IFieldProps) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => {
        const handleEdit = (edit) => {
          onChange(edit.updated_src);
        };

        return (
          <div className={classes.root}>
            <ReactJson
              src={isValidJson(value) ? value : {}}
              onEdit={handleEdit}
              onAdd={handleEdit}
              onDelete={handleEdit}
              theme={{
                base00: "rgba(0, 0, 0, 0)",
                base01: theme.palette.background.default,
                base02: theme.palette.divider,
                base03: "#93a1a1",
                base04: theme.palette.text.disabled,
                base05: theme.palette.text.secondary,
                base06: "#073642",
                base07: theme.palette.text.primary,
                base08: "#d33682",
                base09: "#cb4b16",
                base0A: "#dc322f",
                base0B: "#859900",
                base0C: "#6c71c4",
                base0D: theme.palette.text.secondary,
                base0E: "#2aa198",
                base0F: "#268bd2",
              }}
              iconStyle="triangle"
              style={{
                fontFamily: MONO_FONT,
                backgroundColor: "transparent",
              }}
            />
          </div>
        );
      }}
    />
  );
}
