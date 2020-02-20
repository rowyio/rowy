import React from "react";
import { FieldProps } from "formik";

import {
  makeStyles,
  createStyles,
  FormControl,
  Slider as MuiSlider,
  SliderProps,
  Grid,
  Typography,
} from "@material-ui/core";

import ErrorMessage from "../ErrorMessage";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { display: "flex" },
    slider: { display: "block" },

    thumb: {
      width: 16,
      height: 16,
      marginTop: -7,
      marginLeft: -8,
    },

    valueLabel: {
      top: -22,
      ...theme.typography.overline,
      color: theme.palette.primary.main,

      "& > *": {
        width: "auto",
        minWidth: 24,
        height: 24,

        whiteSpace: "nowrap",
        borderRadius: 500,

        padding: theme.spacing(0, 0.75, 0, 1),
      },
      "& *": { transform: "none" },
    },
  })
);

export interface ISliderProps extends FieldProps, SliderProps {
  label: React.ReactNode;
  units?: string;
  minLabel?: React.ReactNode;
  maxLabel?: React.ReactNode;
}

export default function Slider({
  field,
  form,
  label,
  units,
  minLabel,
  maxLabel,
  min = 0,
  max = 100,
  ...props
}: ISliderProps) {
  const classes = useStyles();

  const handleClick = () => form.setFieldTouched(field.name);
  const handleChange = (event: any, value: number | number[]) => {
    form.setFieldValue(field.name, value);
    form.setFieldTouched(field.name);
  };

  const getAriaValueText = (value: number) =>
    `${value}${units ? " " + units : ""}`;

  const getValueLabelFormat = (value: number) =>
    `${value}${units ? " " + units : ""}`;

  return (
    <FormControl className={classes.root}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Typography variant="overline" component="span" color="textSecondary">
            {minLabel ?? `${min}${units ? " " + units : ""}`}
          </Typography>
        </Grid>

        <Grid item xs>
          <MuiSlider
            valueLabelDisplay="auto"
            min={min}
            max={max}
            getAriaValueText={getAriaValueText}
            valueLabelFormat={getValueLabelFormat}
            {...props}
            value={field.value ?? min}
            onClick={handleClick}
            onChange={handleChange}
            classes={{
              root: classes.slider,
              thumb: classes.thumb,
              valueLabel: classes.valueLabel,
            }}
          />
        </Grid>

        <Grid item>
          <Typography variant="overline" component="span" color="textSecondary">
            {maxLabel ?? `${max}${units ? " " + units : ""}`}
          </Typography>
        </Grid>
      </Grid>

      <ErrorMessage name={field.name} />
    </FormControl>
  );
}
