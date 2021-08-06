import { Control } from "react-hook-form";
import { makeStyles, createStyles } from "@material-ui/styles";
import { FieldType } from "constants/fields";

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
      padding: theme.spacing(1, 1, 1, 1.5),

      // https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/FilledInput/FilledInput.js#L46
      backgroundColor:
        theme.palette.mode === "light"
          ? "rgba(0, 0, 0, 0.06)"
          : "rgba(255, 255, 255, 0.09)",
      "&.Mui-disabled": {
        backgroundColor:
          theme.palette.mode === "light"
            ? "rgba(0, 0, 0, 0.12)"
            : "rgba(255, 255, 255, 0.12)",
      },

      width: "100%",
      minHeight: 36,

      display: "flex",
      textAlign: "left",
      alignItems: "center",

      ...theme.typography.body2,
      color: theme.palette.text.primary,
    },
  })
);
