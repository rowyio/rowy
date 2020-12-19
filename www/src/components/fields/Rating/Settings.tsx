import React from 'react';
import {
  Typography,Slider
} from "@material-ui/core";

import _sortBy from "lodash/sortBy";


const Settings =({
    handleChange,
    config
})=>{
    return (
        <>
          <Typography variant="overline">Maximum number of stars</Typography>
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
          <Typography variant="overline">Slider precision stars</Typography>
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

export default Settings