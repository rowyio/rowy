import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Grid } from "@material-ui/core";
import { Rating as MuiRating } from "@material-ui/lab";
import StarBorderIcon from "@material-ui/icons/StarBorder";

import { useFieldStyles } from "components/SideDrawer/Form/utils";
import { useStatusStyles } from "./styles";

export default function Rating({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();
  const ratingClasses = useStatusStyles();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => (
        <Grid container alignItems="center" className={fieldClasses.root}>
          <>{value}</>
        </Grid>
      )}
    />
  );
}
