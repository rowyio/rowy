import { ISettingsProps } from "@src/components/fields/types";

import { Slider, InputLabel } from "@mui/material";

export default function Settings({ onChange, config }: ISettingsProps) {
  return (
    <>
      <InputLabel>Maximum number of stars</InputLabel>
      <Slider
        defaultValue={5}
        value={config.max}
        getAriaValueText={(v) => `${v} max stars`}
        aria-labelledby="max-slider"
        valueLabelDisplay="auto"
        onChange={(_, v) => {
          onChange("max")(v);
        }}
        step={1}
        marks
        min={1}
        max={15}
      />

      <InputLabel>Slider precision</InputLabel>
      <Slider
        defaultValue={0.5}
        value={config.precision}
        getAriaValueText={(v) => `${v} rating step size`}
        aria-labelledby="precision-slider"
        valueLabelDisplay="auto"
        onChange={(_, v) => {
          onChange("precision")(v);
        }}
        step={0.25}
        marks
        min={0.25}
        max={1}
      />
    </>
  );
}
