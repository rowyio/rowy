import { ISettingsProps } from "@src/components/fields/types";
import { TextField, Button } from "@mui/material";

export default function Settings({ onChange, config }: ISettingsProps) {
  const copyStandardRegex = () => {
    onChange("validationRegex")(
      "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+.[a-zA-z]{2,3}$"
    );
  };

  return (
    <>
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
      <Button
        style={{ width: "200px", margin: "20px auto auto" }}
        onClick={copyStandardRegex}
      >
        Use standard regex
      </Button>
    </>
  );
}
