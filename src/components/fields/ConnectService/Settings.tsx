import { TextField, FormControlLabel, Switch } from "@material-ui/core";

export default function Settings({ config, handleChange }) {
  return (
    <>
      <TextField
        label="Webservice Url"
        name="url"
        value={config.url}
        fullWidth
        onChange={(e) => {
          handleChange("url")(e.target.value);
        }}
      />
      <TextField
        label="Results key Path"
        name="resultsKey"
        helperText="Can be specified as a key path"
        placeholder="data.results"
        value={config.resultsKey}
        fullWidth
        onChange={(e) => {
          handleChange("resultsKey")(e.target.value);
        }}
      />
      <TextField
        label="Primary Key"
        name="primaryKey"
        value={config.primaryKey}
        fullWidth
        onChange={(e) => {
          handleChange("primaryKey")(e.target.value);
        }}
      />
      <TextField
        label="Title Key (optional)"
        name="titleKey"
        value={config.titleKey}
        fullWidth
        onChange={(e) => {
          handleChange("titleKey")(e.target.value);
        }}
      />
      <TextField
        label="SubTitle Key (optional)"
        name="subtitleKey"
        value={config.subtitleKey}
        fullWidth
        onChange={(e) => {
          handleChange("subtitleKey")(e.target.value);
        }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={config.multiple}
            onChange={() => handleChange("multiple")(!Boolean(config.multiple))}
            name="select-multiple"
          />
        }
        label="Enable multiple item selection"
      />
    </>
  );
}
