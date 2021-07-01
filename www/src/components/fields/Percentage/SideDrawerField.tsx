import { Controller, useWatch } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { makeStyles, createStyles, TextField } from "@material-ui/core";
import { emphasize } from "@material-ui/core/styles";
import { resultColorsScale } from "utils/color";

const useStyles = makeStyles((theme) =>
  createStyles({
    resultColor: ({ value }: { value: number | undefined }) => ({
      backgroundColor:
        typeof value === "number"
          ? resultColorsScale(value).hex() + "!important"
          : undefined,
      color:
        typeof value === "number"
          ? emphasize(resultColorsScale(value).hex(), 1) + "!important"
          : undefined,
    }),

    underline: {
      "&::after": {
        borderColor: theme.palette.text.primary,
      },
    },
  })
);

export default function Percentage({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const value: number | undefined = useWatch({ control, name: column.key });
  const classes = useStyles({ value });

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        const handleChange = (e) => onChange(Number(e.target.value) / 100);

        return (
          <TextField
            variant="filled"
            fullWidth
            margin="none"
            placeholder={column.name}
            onChange={handleChange}
            onBlur={onBlur}
            value={typeof value === "number" ? value * 100 : value}
            id={`sidedrawer-field-${column.key}`}
            label=""
            hiddenLabel
            disabled={disabled}
            type="number"
            InputProps={{
              endAdornment: "%",
              classes: {
                root: classes.resultColor,
                underline: classes.underline,
              },
            }}
          />
        );
      }}
    />
  );
}
