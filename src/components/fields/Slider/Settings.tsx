import { TextField, FormControlLabel, Switch } from "@mui/material";
import Subheading from "components/Table/ColumnMenu/Subheading";

export default function Settings({ handleChange, config }) {
  return (
    <>
      <Subheading>Slider config</Subheading>

      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => handleChange("min")(parseFloat(e.target.value))}
        value={config["min"]}
        id={`settings-field-min`}
        label="Minimum value"
        type="number"
      />

      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => handleChange("max")(parseFloat(e.target.value))}
        value={config["max"]}
        id={`settings-field-max`}
        label="Maximum value"
        type="number"
      />

      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => handleChange("step")(parseFloat(e.target.value))}
        value={config["step"]}
        id={`settings-field-step`}
        label="Step value"
        type="number"
      />

      <FormControlLabel
        control={
          <Switch
            checked={config.marks}
            onChange={() => handleChange("marks")(!Boolean(config.marks))}
            name="marks"
          />
        }
        label="Show slider steps"
        sx={{
          alignItems: "center",
          "& .MuiFormControlLabel-label": { mt: 0 },
        }}
      />
    </>
  );
}
