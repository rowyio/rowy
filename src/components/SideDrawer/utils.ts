// import { Control } from "react-hook-form";
import { colord } from "colord";
import type { SystemStyleObject, Theme } from "@mui/system";

// import { FieldType } from "@src/constants/fields";
// import { TableRowRef } from "@src/types/table";

// export interface ISideDrawerFieldProps {
//   control: Control;
//   name: string;
//   docRef: TableRowRef;
//   editable?: boolean;
// }

// export type Values = Record<string, any>;
// export type Field = {
//   type?: FieldType;
//   name: string;
//   label?: string;
//   [key: string]: any;
// };
// export type Fields = (Field | ((values: Values) => Field))[];

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
