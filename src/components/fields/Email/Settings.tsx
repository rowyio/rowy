import { ISettingsProps } from "@src/components/fields/types";
import { TextField } from "@mui/material";

export default function Settings({ onChange, config }: ISettingsProps) {
    return (
        <>
            <TextField
                type="text"
                label="Validation regex"
                id="validation-regex"
                value={config.validationRegex}
                defaultValue="[a-z0-9]+@[a-z]+\.[a-z]{2,3}"
                fullWidth
                onChange={(e) => {
                    if (e.target.value === "") onChange("validationRegex")(null);
                    else onChange("validationRegex")(e.target.value);
                }}
            />
        </>
    );
}
