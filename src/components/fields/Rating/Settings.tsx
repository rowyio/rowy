import { ISettingsProps } from "../types";

import { Slider } from "@mui/material";
import Subheading from "@src/components/Table/ColumnMenu/Subheading";

export default function Settings({ onChange, config }: ISettingsProps) {
  return (
    <>
      <Subheading>Maximum number of stars</Subheading>
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
      <Subheading>Slider precision</Subheading>
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
