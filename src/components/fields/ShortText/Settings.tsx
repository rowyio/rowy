import { ISettingsProps } from "@src/components/fields/types";
import { TextField } from "@mui/material";

export default function Settings({ onChange, config }: ISettingsProps) {
  return (
    <>
      <TextField
        type="number"
        label="Character limit"
        id="character-limit"
        value={config.maxLength}
        fullWidth
        onChange={(e) => {
          if (e.target.value === "0") onChange("maxLength")(null);
          else onChange("maxLength")(e.target.value);
        }}
      />
      <TextField
        type="text"
        label="Validation regex"
        id="validation-regex"
        value={config.validationRegex}
        fullWidth
        onChange={(e) => {
          if (e.target.value === "") onChange("validationRegex")(null);
          else onChange("validationRegex")(e.target.value);
        }}
      />
    </>
  );
}
