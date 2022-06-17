import { colord } from "colord";
import type { SystemStyleObject, Theme } from "@mui/system";

export const fieldSx: SystemStyleObject<Theme> = {
  borderRadius: 1,
  py: 0.5,
  px: 1.5,

  backgroundColor: "action.input",
  boxShadow: (theme) =>
    `0 0 0 1px ${
      theme.palette.mode === "dark"
        ? colord(theme.palette.divider)
            .alpha(colord(theme.palette.divider).alpha() / 2)
            .toHslString()
        : theme.palette.divider
    } inset`,

  "&.Mui-disabled": {
    backgroundColor: (theme) =>
      theme.palette.mode === "dark"
        ? "transparent"
        : theme.palette.action.disabledBackground,
  },

  width: "100%",
  minHeight: 32,
  boxSizing: "border-box",

  display: "flex",
  textAlign: "left",
  alignItems: "center",

  typography: "body2",
  color: "text.primary",
};

export const getLabelId = (key: string) => `sidedrawer-label-${key}`;
export const getFieldId = (key: string) => `sidedrawer-field-${key}`;
