import { ISettingsProps } from "@src/components/fields/types";
import RatingIcon from "@mui/icons-material/Star";
import RatingOutlineIcon from "@mui/icons-material/StarBorder"
import { InputLabel, TextField, Grid, FormControlLabel, Checkbox, Stack } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MuiRating from "@mui/material/Rating";
import { get } from "lodash-es";

export default function Settings({ onChange, config }: ISettingsProps) {
  return (
    <Grid container spacing={2} justifyItems="end" direction={"row"}>
      <Grid item xs={6}>
        <TextField
          label="Highest possible rating"
          type={"number"}
          value={config.max}
          fullWidth
          error={false}
          onChange={(e) => {
            let input = parseInt(e.target.value) || 0
            if (input > 20) { input = 20 }
            onChange("max")(input);
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <InputLabel>Rating fraction</InputLabel>
        <ToggleButtonGroup
          value={config.precision}
          exclusive
          fullWidth
          onChange={(_, value) => {
            onChange("precision")(value);
          }}
          aria-label="text alignment"
          sx={{ pt: 0.5 }}
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
      <Grid item xs={6}>
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
          label="Customize ratings with emoji"
          style={{ marginLeft: -11 }}
        />
      </Grid>
      {config.customIcons?.enabled && (
        <Grid item xs={6} sm={true}>
          <Stack direction="row" spacing={1}>
            <TextField
              id="customIcons.rating"
              value={get(config, "customIcons.rating")}
              onChange={(e) =>
                onChange("customIcons.rating")(e.target.value)
              }
              label="Custom icon preview:"
              className="labelHorizontal"
              inputProps={{ style: { width: "2ch" } }}
            />

            <MuiRating aria-label="Preview of the rating field with custom icon"
              name="Preview"
              onClick={(e) => e.stopPropagation()}
              icon={get(config, "customIcons.rating") || <RatingIcon />}
              size="small"
              emptyIcon={get(config, "customIcons.rating") || <RatingOutlineIcon />}
              max={get(config, "max")}
              precision={get(config, "precision")}
              sx={{ pt: 0.5 }}
            />
          </Stack>

        </Grid>
      )}
    </Grid>
  );
}