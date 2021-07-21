import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { makeStyles, createStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    multiline: { padding: theme.spacing(2.25, 1.5) },
  })
);

export default function LongText({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        return (
          <TextField
            variant="filled"
            fullWidth
            margin="none"
            placeholder={column.name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            id={`sidedrawer-field-${column.key}`}
            label=""
            hiddenLabel
            disabled={disabled}
            multiline
            InputProps={{ classes: { multiline: classes.multiline } }}
            inputProps={{ minRows: 5, maxLength: column.config?.maxLength }}
          />
        );
      }}
    />
  );
}
