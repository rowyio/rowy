import { TextField } from "@mui/material";

export default function Settings({ handleChange, config }) {
  return (
    <>
      <TextField
        type="number"
        label="Character limit"
        id="character-limit"
        value={config.maxLength}
        fullWidth
        onChange={(e) => {
          if (e.target.value === "0") handleChange("maxLength")(null);
          else handleChange("maxLength")(e.target.value);
        }}
      />
      <TextField
        type="text"
        label="Validation regex"
        id="validation-regex"
        value={config.validationRegex}
        fullWidth
        onChange={(e) => {
          if (e.target.value === "") handleChange("validationRegex")(null);
          else handleChange("validationRegex")(e.target.value);
        }}
      />
    </>
  );
}
