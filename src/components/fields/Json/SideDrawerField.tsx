import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import ReactJson from "react-json-view";
import jsonFormat from "json-format";

import { useTheme } from "@mui/material";
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

export default function Json({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, value } }) => {
        if (disabled)
          return (
            <div
              className={fieldClasses.root}
              style={{
                whiteSpace: "pre-wrap",
                ...theme.typography.caption,
                fontFamily: theme.typography.fontFamilyMono,
                wordBreak: "break-word",
              }}
            >
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
          <div
            className={fieldClasses.root}
            style={{ overflowX: "auto", ...theme.typography.caption }}
          >
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
