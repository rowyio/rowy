import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Grid } from "@material-ui/core";

import "@material-ui/lab";

import { useFieldStyles } from "components/SideDrawer/Form/utils";
import { useStatusStyles } from "./styles";

export default function Rating({ control, column }: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();
  const ratingClasses = useStatusStyles();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ value }) => (
        <Grid container alignItems="center" className={fieldClasses.root}>
          <>{value}</>
        </Grid>
      )}
    />
  );
}
