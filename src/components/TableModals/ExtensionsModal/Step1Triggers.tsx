import { useAtom } from "jotai";
import { IExtensionModalStepProps } from "./ExtensionModal";

import {
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Checkbox,
} from "@mui/material";
import MultiSelect from "@rowy/multiselect";
import ColumnSelect from "@src/components/Table/ColumnSelect";

import {
  projectScope,
  compatibleRowyRunVersionAtom,
} from "@src/atoms/projectScope";
import { FieldType } from "@src/constants/fields";
import { triggerTypes } from "./utils";

export default function Step1Triggers({
  extensionObject,
  setExtensionObject,
}: IExtensionModalStepProps) {
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    projectScope
  );

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
                  <ColumnSelect
                    multiple={true}
                    label="Tracked fields (optional)"
                    filterColumns={(column) =>
                      column.type !== FieldType.subTable
                    }
                    showFieldNames
                    value={extensionObject.trackedFields ?? []}
                    onChange={(trackedFields: string[]) => {
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
