import { ISettingsProps } from "@src/components/fields/types";

import { Slider, InputLabel, TextField, Grid } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function Settings({ onChange, config }: ISettingsProps) {
  return (
    <>
      <Grid container spacing={2} justifyItems="end" direction={"row"}>
        <Grid item xs={6}>
          <TextField
            label="Maximum number of stars"
            type={"number"}
            value={config.max}
            fullWidth
            onChange={(e) => {
              onChange("max")(parseInt(e.target.value));
            }}
            inputProps={{ min: 1, max: 20 }}
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Star fraction</InputLabel>
          <ToggleButtonGroup
            value={config.precision}
            exclusive
            fullWidth
            onChange={(_, value) => {
              onChange("precision")(value);
            }}
            aria-label="text alignment"
          >
            <ToggleButton value={0.25} aria-label="quarter">
              1/4
            </ToggleButton>
            <ToggleButton value={0.5} aria-label="half">
              1/2
            </ToggleButton>
            <ToggleButton value={1} aria-label="whole">
              1
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}
