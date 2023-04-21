import { Typography, FormControlLabel, Checkbox } from "@mui/material";
import { ISettingsProps } from "@src/components/fields/types";

export default function Settings({ onChange, config }: ISettingsProps) {
  return (
    <FormControlLabel
      value="required"
      label={
        <>
          Accept multiple value
          <Typography variant="caption" color="text.secondary" display="block">
            Make this column to support multiple values.
          </Typography>
        </>
      }
      control={
        <Checkbox
          checked={config?.multiple}
          onChange={(e) => onChange("multiple")(e.target.checked)}
          name="multiple"
        />
      }
    />
  );
}
