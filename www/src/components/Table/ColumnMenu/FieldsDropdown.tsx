import React from "react";

import {
  TextField,
  MenuItem,
  ListItemIcon,
  TextFieldProps,
} from "@material-ui/core";

import { FIELDS, FieldType } from "constants/fields";

export interface IFieldsDropdownProps {
  value: FieldType;
  onChange: TextFieldProps["onChange"];
}

/**
 * Returns dropdown component of all available types
 */
export default function FieldsDropdown({
  value,
  onChange,
}: IFieldsDropdownProps) {
  return (
    <TextField
      fullWidth
      select
      value={value ? value : ""}
      onChange={onChange}
      inputProps={{ name: "type", id: "type" }}
      label="Field type"
    >
      {FIELDS.map(
        (field: { icon: JSX.Element; name: string; type: FieldType }) => {
          return (
            <MenuItem
              key={`select-field-${field.name}`}
              id={`select-field-${field.type}`}
              value={field.type}
            >
              <ListItemIcon style={{ verticalAlign: "text-bottom" }}>
                {field.icon}
              </ListItemIcon>
              {field.name}
            </MenuItem>
          );
        }
      )}
    </TextField>
  );
}
