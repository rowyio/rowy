import { Control } from "react-hook-form";
import { makeStyles, createStyles } from "@mui/styles";
import { FieldType } from "@src/constants/fields";
import { colord } from "colord";

export interface IFieldProps {
  control: Control;
  name: string;
  docRef: firebase.default.firestore.DocumentReference;
  editable?: boolean;
}

export type Values = Record<string, any>;
export type Field = {
  type?: FieldType;
  name: string;
  label?: string;
  [key: string]: any;
};
export type Fields = (Field | ((values: Values) => Field))[];

export const useFieldStyles = makeStyles((theme) =>
  createStyles({
    root: {
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0.5, 1.5),

      backgroundColor: theme.palette.action.input,
      boxShadow: `0 0 0 1px ${
        theme.palette.mode === "dark"
          ? colord(theme.palette.divider)
              .alpha(colord(theme.palette.divider).alpha() / 2)
              .toHslString()
          : theme.palette.divider
      } inset`,

      "&.Mui-disabled": {
        backgroundColor:
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

      ...theme.typography.body2,
      color: theme.palette.text.primary,
    },
  })
);
