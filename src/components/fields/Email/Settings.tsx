import { ISettingsProps } from "@src/components/fields/types";
import { TextField, Button } from "@mui/material";
import { useRef } from "react";

export default function Settings({ onChange, config }: ISettingsProps) {

    const emailFieldValidation = useRef<HTMLInputElement>(null);
    const useStandardRegex = () => {
        if (emailFieldValidation.current != null) {
            emailFieldValidation.current.value = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+.[a-zA-z]{2,3}$";  
        }
    }

    return (
        <>
            <TextField
                inputRef={emailFieldValidation}
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
            <Button style={{ width: "200px", margin: "20px auto auto" }} onClick={useStandardRegex}>
                Use standard Regex
            </Button>
        </>
    );
}
