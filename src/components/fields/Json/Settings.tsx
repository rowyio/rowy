import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";

const Settings = ({ config, handleChange }) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={config.isArray}
            onChange={() => handleChange("isArray")(!Boolean(config.isArray))}
            name="isArray"
          />
        }
        label={
          <>
            Default as array
            <FormHelperText>
              You can still set individual field values as a JSON object or
              array using the code editor
            </FormHelperText>
          </>
        }
      />
    </>
  );
};
export default Settings;
