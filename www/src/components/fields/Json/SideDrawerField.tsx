import clsx from "clsx";
import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import ReactJson from "react-json-view";
import jsonFormat from "json-format";

import { makeStyles, createStyles, useTheme } from "@material-ui/core";
import { useFieldStyles } from "components/SideDrawer/Form/utils";

const isValidJson = (val: any) => {
  try {
    if (typeof val === "string") JSON.parse(val);
    else JSON.stringify(val);
  } catch (error) {
    return false;
  }
  return true;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      margin: 0,
      overflowX: "auto",
      ...theme.typography.body2,
    },

    readOnly: {
      whiteSpace: "pre-wrap",
      ...theme.typography.body2,
      fontFamily: theme.typography.fontFamilyMono,
      wordBreak: "break-word",
    },
  })
);

export default function Json({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        if (disabled)
          return (
            <div className={clsx(fieldClasses.root, classes.readOnly)}>
              {value &&
                jsonFormat(value, {
                  type: "space",
                  char: " ",
                  size: 2,
                })}
            </div>
          );

        const handleEdit = (edit) => {
          onChange(edit.updated_src);
        };

        return (
          <div className={clsx(fieldClasses.root, classes.root)}>
            <ReactJson
              src={
                value !== undefined && isValidJson(value)
                  ? value
                  : column.config?.isArray
                  ? []
                  : {}
              }
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
                fontFamily: theme.typography.fontFamilyMono,
                backgroundColor: "transparent",
              }}
            />
          </div>
        );
      }}
    />
  );
}
