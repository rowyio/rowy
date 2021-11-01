import MultiSelect from "@rowy/multiselect";
import { ListItemIcon } from "@mui/material";

import { FIELDS } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

export interface IFieldsDropdownProps {
  value: FieldType;
  onChange: (value: FieldType) => void;
  hideLabel?: boolean;
  label?: string;
  options?: FieldType[];
  [key: string]: any;
}

/**
 * Returns dropdown component of all available types
 */
export default function FieldsDropdown({
  value,
  onChange,
  hideLabel = false,
  label,
  options: optionsProp,
  ...props
}: IFieldsDropdownProps) {
  const options = optionsProp
    ? FIELDS.filter((fieldConfig) => optionsProp.indexOf(fieldConfig.type) > -1)
    : FIELDS;

  return (
    <MultiSelect
      multiple={false}
      {...props}
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
      label={label || "Field type"}
      labelPlural="field types"
      TextFieldProps={{
        hiddenLabel: hideLabel,
        helperText: value && getFieldProp("description", value),
        ...props.TextFieldProps,
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
          ...props.TextFieldProps?.SelectProps,
        },
      }}
    />
  );
}
