import { IExtensionModalStepProps } from "./ExtensionModal";

import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { triggerTypes } from "./utils";

export default function Step1Triggers({
  extensionObject,
  setExtensionObject,
}: IExtensionModalStepProps) {
  return (
    <FormControl component="fieldset" required>
      <FormLabel component="legend" className="visually-hidden">
        Triggers
      </FormLabel>

      <FormGroup>
        {triggerTypes.map((trigger) => (
          <FormControlLabel
            key={trigger}
            label={trigger}
            control={
              <Checkbox
                checked={extensionObject.triggers.includes(trigger)}
                name={trigger}
                onChange={() => {
                  setExtensionObject((extensionObject) => {
                    if (extensionObject.triggers.includes(trigger)) {
                      return {
                        ...extensionObject,
                        triggers: extensionObject.triggers.filter(
                          (t) => t !== trigger
                        ),
                      };
                    } else {
                      return {
                        ...extensionObject,
                        triggers: [...extensionObject.triggers, trigger],
                      };
                    }
                  });
                }}
              />
            }
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}
