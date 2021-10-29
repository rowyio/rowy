import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Slider as MuiSlider, Stack, Typography } from "@mui/material";
import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";

export default function Slider({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();

  const config: {
    max: number;
    min: number;
    minLabel?: string;
    maxLabel?: string;
    step: number;
    unit: string;
    marks?: boolean;
  } = {
    max: 10,
    step: 1,
    units: "",
    min: 0,
    ...(column as any).config,
  };
  const { max, marks, min, unit, minLabel, maxLabel, step } = config;

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => {
        const handleChange = (_: any, value: number | number[]) => {
          onChange(value);
          onBlur();
        };

        const getAriaValueText = (value: number) =>
          `${value}${unit ? " " + unit : ""}`;

        const getValueLabelFormat = (value: number) =>
          `${value}${unit ? " " + unit : ""}`;

        return (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            className={fieldClasses.root}
            style={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <Typography variant="button" component="span" color="textSecondary">
              {minLabel ?? `${min}${unit ? " " + unit : ""}`}
            </Typography>

            <MuiSlider
              valueLabelDisplay="auto"
              min={min}
              max={max}
              marks={marks}
              step={step ?? 1}
              getAriaValueText={getAriaValueText}
              valueLabelFormat={getValueLabelFormat}
              value={value ?? min}
              onClick={onBlur}
              onChange={handleChange}
              disabled={disabled}
              style={{ display: "block", flexGrow: 1 }}
            />

            <Typography variant="button" component="span" color="textSecondary">
              {maxLabel ?? `${max}${unit ? " " + unit : ""}`}
            </Typography>
          </Stack>
        );
      }}
    />
  );
}
