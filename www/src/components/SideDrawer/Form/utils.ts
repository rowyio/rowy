import { Control } from "react-hook-form";
import { makeStyles, createStyles } from "@material-ui/core";
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
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      padding: theme.spacing(1, 1, 1, 1.5),

      width: "100%",
      minHeight: 56,

      display: "flex",
      textAlign: "left",
      alignItems: "center",

      ...theme.typography.body1,
      color: theme.palette.text.primary,
    },
  })
);
