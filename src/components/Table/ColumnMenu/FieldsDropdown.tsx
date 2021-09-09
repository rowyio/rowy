import MultiSelect from "@antlerengineering/multiselect";
import { ListItemIcon } from "@material-ui/core";

import { FIELDS } from "components/fields";
import { FieldType } from "constants/fields";
import { getFieldProp } from "components/fields";

export interface IFieldsDropdownProps {
  value: FieldType;
  onChange: (value: FieldType) => void;
  hideLabel?: boolean;
  options?: FieldType[];
}

/**
 * Returns dropdown component of all available types
 */
export default function FieldsDropdown({
  value,
  onChange,
  hideLabel = false,
  options: optionsProp,
}: IFieldsDropdownProps) {
  const options = optionsProp
    ? FIELDS.filter((fieldConfig) => optionsProp.indexOf(fieldConfig.type) > -1)
    : FIELDS;

  return (
    <MultiSelect
      multiple={false}
      value={value ? value : ""}
      onChange={onChange}
      options={options.map((fieldConfig) => ({
        label: fieldConfig.name,
        value: fieldConfig.type,
      }))}
      {...({
        AutocompleteProps: {
          groupBy: (option) => getFieldProp("group", option.value),
        },
      } as any)}
      itemRenderer={(option) => (
        <>
          <ListItemIcon style={{ minWidth: 40 }}>
            {getFieldProp("icon", option.value as FieldType)}
          </ListItemIcon>
          {option.label}
        </>
      )}
      label="Field Type"
      labelPlural="Field Types"
      TextFieldProps={{
        hiddenLabel: hideLabel,
        helperText: value && getFieldProp("description", value),
        SelectProps: {
          displayEmpty: true,
          renderValue: () => (
            <>
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  verticalAlign: "text-bottom",
                  "& svg": { my: -0.5 },
                }}
              >
                {getFieldProp("icon", value as FieldType)}
              </ListItemIcon>
              {getFieldProp("name", value as FieldType)}
            </>
          ),
        },
      }}
    />
  );
}
