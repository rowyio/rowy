import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Slider as MuiSlider, Stack, Typography } from "@mui/material";
import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";

export default function Slider({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
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

  const handleChange = (_: any, value: number | number[]) => {
    onChange(value);
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
      sx={fieldSx}
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      <Typography variant="button" component="span" color="textSecondary">
        {minLabel ?? `${min}${unit ? " " + unit : ""}`}
      </Typography>

      <MuiSlider
        valueLabelDisplay="on"
        min={min}
        max={max}
        marks={marks}
        step={step ?? 1}
        getAriaValueText={getAriaValueText}
        valueLabelFormat={getValueLabelFormat}
        value={value ?? min}
        onChange={handleChange}
        onBlur={onSubmit}
        disabled={disabled}
        id={getFieldId(column.key)}
        style={{ display: "block", flexGrow: 1 }}
      />

      <Typography variant="button" component="span" color="textSecondary">
        {maxLabel ?? `${max}${unit ? " " + unit : ""}`}
      </Typography>
    </Stack>
  );
}
