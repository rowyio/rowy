import { Switch, FormControlLabel } from "@material-ui/core";

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
        label="Set as an array"
      />
    </>
  );
};
export default Settings;
