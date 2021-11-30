import { IExtensionModalStepProps } from "./ExtensionModal";
import _sortBy from "lodash/sortBy";

import { Typography, ListItemIcon } from "@mui/material";
import MultiSelect from "@rowy/multiselect";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

export default function Step2RequiredFields({
  extensionObject,
  setExtensionObject,
}: IExtensionModalStepProps) {
  const { tableState } = useProjectContext();

  return (
    <>
      <Typography gutterBottom>
        Optionally, select fields that must have a value set for the extension
        to be triggered for that row
      </Typography>

      <MultiSelect
        aria-label="Required fields"
        multiple
        value={extensionObject.requiredFields}
        disabled={!tableState?.columns}
        options={
          tableState?.columns
            ? _sortBy(Object.values(tableState!.columns), "index")
                .filter((c) => c.type !== FieldType.id)
                .map((c) => ({
                  value: c.key,
                  label: c.name,
                  type: c.type,
                }))
            : []
        }
        onChange={(requiredFields) =>
          setExtensionObject((e) => ({ ...e, requiredFields }))
        }
        TextFieldProps={{ autoFocus: true }}
        freeText
        AddButtonProps={{ children: "Add other field…" }}
        AddDialogProps={{
          title: "Add other field",
          textFieldLabel: "Field key",
        }}
        itemRenderer={(option: {
          value: string;
          label: string;
          type?: FieldType;
        }) => (
          <>
            <ListItemIcon style={{ minWidth: 40 }}>
              {option.type && getFieldProp("icon", option.type)}
            </ListItemIcon>
            {option.label}
            <code style={{ marginLeft: "auto" }}>{option.value}</code>
          </>
        )}
      />
    </>
  );
}
