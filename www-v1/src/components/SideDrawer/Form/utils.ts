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
      padding: theme.spacing(0.75, 1, 0.75, 1.5),

      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
      "&.Mui-disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
      },

      width: "100%",
      minHeight: 32,

      display: "flex",
      textAlign: "left",
      alignItems: "center",

      ...theme.typography.body2,
      color: theme.palette.text.primary,
    },
  })
);
