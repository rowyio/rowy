import { Switch, FormControlLabel } from "@mui/material";

const Settings = ({ config, handleChange }) => {
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={config.isArray}
            onChange={() => handleChange("isArray")(!Boolean(config.isArray))}
            name="isArray"
          />
        }
        label="Set as array"
        sx={{
          alignItems: "center",
          "& .MuiFormControlLabel-label": { mt: 0 },
        }}
      />
    </>
  );
};
export default Settings;
