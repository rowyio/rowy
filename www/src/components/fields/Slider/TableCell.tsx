import { IHeavyCellProps } from "../types";

import { makeStyles, createStyles, Grid } from "@material-ui/core";

import { resultColorsScale } from "utils/color";

const useStyles = makeStyles((theme) =>
  createStyles({
    progress: {
      width: "100%",
      backgroundColor: theme.palette.divider,
      borderRadius: theme.shape.borderRadius,
    },
    bar: {
      borderRadius: theme.shape.borderRadius,
      height: 16,
      maxWidth: "100%",
    },
  })
);

export default function Slider({ column, value }: IHeavyCellProps) {
  const classes = useStyles();

  const {
    max,
    min,
    unit,
  }: {
    max: number;
    min: number;
    unit?: string;
  } = {
    max: 10,
    min: 0,
    ...(column as any).config,
  };

  const progress =
    value < min || typeof value !== "number"
      ? 0
      : ((value - min) / (max - min)) * 100;

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={1}>
      <Grid item xs={6}>
        {value ?? 0}/{max} {unit}
      </Grid>
      <Grid item xs={6}>
        <div className={classes.progress}>
          <div
            className={classes.bar}
            style={{
              width: `${progress}%`,
              backgroundColor: resultColorsScale(progress / 100).hex(),
            }}
          ></div>
        </div>
      </Grid>
    </Grid>
  );
}
