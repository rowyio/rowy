import { ISettingsProps } from "@src/components/fields/types";
import RatingIcon from "@mui/icons-material/Star";
import { Slider, InputLabel, TextField, Grid, FormControlLabel, Checkbox, Stack, Fab } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { get } from "lodash-es";

export default function Settings({ onChange, config }: ISettingsProps) {
  return (
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
      <FormControlLabel
        control={
          <Checkbox
            checked={config.customIcons?.enabled}
            onChange={(e) =>
              onChange("customIcons.enabled")(e.target.checked)
            }
            name="customIcons.enabled"
          />
        }
        label="Customize button icons with emoji"
        style={{ marginLeft: -11 }}
      />
      {config.customIcons?.enabled && (
        <Grid container spacing={2} sx={{ mt: { xs: 0, sm: -1 } }}>
          <Grid item xs={12} sm={true}>
            <Stack direction="row" spacing={1}>
              <TextField
                id="customIcons.rating"
                value={get(config, "customIcons.rating")}
                onChange={(e) =>
                  onChange("customIcons.rating")(e.target.value)
                }
                label="Rating:"
                className="labelHorizontal"
                inputProps={{ style: { width: "3ch" } }}
              />
              <Fab size="small" aria-label="Preview of rating button">
                {get(config, "customIcons.rating") || <RatingIcon />}
              </Fab>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}