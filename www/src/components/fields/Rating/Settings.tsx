import React from "react";
import { ISettingsProps } from "../types";

import { Slider } from "@material-ui/core";
import SettingsHeading from "components/Table/ColumnMenu/Settings/SettingsHeading";

import _sortBy from "lodash/sortBy";

export default function Rating({ handleChange, config }: ISettingsProps) {
  return (
    <>
      <SettingsHeading>Maximum number of stars</SettingsHeading>
      <Slider
        defaultValue={5}
        value={config.max}
        getAriaValueText={(v) => `${v} max stars`}
        aria-labelledby="max-slider"
        valueLabelDisplay="auto"
        onChange={(_, v) => {
          handleChange("max")(v);
        }}
        step={1}
        marks
        min={1}
        max={15}
      />
      <SettingsHeading>Slider precision</SettingsHeading>
      <Slider
        defaultValue={0.5}
        value={config.precision}
        getAriaValueText={(v) => `${v} rating step size`}
        aria-labelledby="precision-slider"
        valueLabelDisplay="auto"
        onChange={(_, v) => {
          handleChange("precision")(v);
        }}
        step={0.25}
        marks
        min={0.25}
        max={1}
      />
    </>
  );
}
