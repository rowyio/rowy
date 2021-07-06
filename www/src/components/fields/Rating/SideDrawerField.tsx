import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Grid } from "@material-ui/core";
import { Rating as MuiRating } from "@material-ui/lab";
import StarBorderIcon from "@material-ui/icons/StarBorder";

import { useFieldStyles } from "components/SideDrawer/Form/utils";
import { useRatingStyles } from "./styles";

export default function Rating({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();
  const ratingClasses = useRatingStyles();

  // Set max and precision from config
  const {
    max,
    precision,
  }: {
    max: number;
    precision: number;
  } = {
    max: 5,
    precision: 1,
    ...column.config,
  };

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => (
        <Grid container alignItems="center" className={fieldClasses.root}>
          <MuiRating
            name={column.key as string}
            id={`sidedrawer-field-${column.key}`}
            value={typeof value === "number" ? value : 0}
            disabled={disabled}
            onChange={(_, newValue) => onChange(newValue)}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            max={max}
            precision={precision}
            classes={ratingClasses}
          />
        </Grid>
      )}
    />
  );
}
