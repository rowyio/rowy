import React from "react";
import { Controller,useWatch } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";
import {
  makeStyles,
  createStyles,
  FormControl,
  Slider as MuiSlider,
  SliderProps,
  Grid,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
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



export default function Slider({   control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const value: number | undefined = useWatch({ control, name: column.key });

  const config: {
    max: number;
    min: number;
    minLabel?:string;
    maxLabel?:string;
    precision: number;
    unit: string;
    marks?:boolean;
  } = {
    max:10, precision:1,units:"",min:0,...(column as any).config
  }
  const { max, marks,min,unit,minLabel,maxLabel } = config
  const classes = useStyles();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        const handleChange = (_: any, value: number | number[]) => {
          onChange(value);
          onBlur();
        };

        const getAriaValueText = (value: number) =>
          `${value}${unit ? " " + unit : ""}`;

        const getValueLabelFormat = (value: number) =>
          `${value}${unit ? " " + unit : ""}`;

        return (

  
        <Grid container spacing={2} alignItems="center" className={classes.root}>
        <Grid item>
          <Typography
            variant="overline"
            component="span"
            color="textSecondary"
          >
            {minLabel ?? `${min}${unit ? " " + unit : ""}`}
          </Typography>
        </Grid>

        <Grid item xs>
          <MuiSlider
            valueLabelDisplay="auto"
            min={min}
            max={max}
            marks={marks}
            getAriaValueText={getAriaValueText}
            valueLabelFormat={getValueLabelFormat}
            value={value ?? min}
            onClick={onBlur}
            onChange={handleChange}
            classes={{
              root: classes.slider,
              thumb: classes.thumb,
              valueLabel: classes.valueLabel,
            }}
          />
        </Grid>

        <Grid item>
          <Typography
            variant="overline"
            component="span"
            color="textSecondary"
          >
            {maxLabel ?? `${max}${unit ? " " + unit : ""}`}
          </Typography>
        </Grid>
      </Grid>
      )}}
    />
  );
}
