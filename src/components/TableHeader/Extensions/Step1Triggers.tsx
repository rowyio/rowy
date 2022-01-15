import { IExtensionModalStepProps } from "./ExtensionModal";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { FieldType } from "@src/constants/fields";
import MultiSelect from "@rowy/multiselect";
import { FormHelperText } from "@mui/material";

import {
  Typography,
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
  const { tableState, compatibleRowyRunVersion } = useProjectContext();
  if (!tableState?.columns) return <></>;
  const columnOptions = Object.values(tableState.columns)
    .filter((column) => column.type !== FieldType.subTable)
    .map((c) => ({ label: c.name, value: c.key }));

  return (
    <>
      <Typography gutterBottom>
        Select which events trigger this extension
      </Typography>

      <FormControl component="fieldset" required>
        <FormLabel component="legend" className="visually-hidden">
          Triggers
        </FormLabel>

        <FormGroup>
          {triggerTypes.map((trigger) => (
            <>
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
              {trigger === "update" &&
                extensionObject.triggers.includes("update") &&
                compatibleRowyRunVersion!({ minVersion: "1.2.4" }) && (
                  <MultiSelect
                    label="Tracked fields (optional)"
                    options={columnOptions}
                    value={extensionObject.trackedFields ?? []}
                    onChange={(trackedFields) => {
                      setExtensionObject((extensionObject) => {
                        return {
                          ...extensionObject,
                          trackedFields,
                        };
                      });
                    }}
                    TextFieldProps={{
                      helperText: (
                        <>
                          <FormHelperText error={false} style={{ margin: 0 }}>
                            Only Changes to these fields will trigger the
                            extension. If left blank, any update will trigger
                            the extension.
                          </FormHelperText>
                        </>
                      ),
                      FormHelperTextProps: { component: "div" } as any,
                      required: false,
                    }}
                  />
                )}
            </>
          ))}
        </FormGroup>
      </FormControl>
    </>
  );
}
