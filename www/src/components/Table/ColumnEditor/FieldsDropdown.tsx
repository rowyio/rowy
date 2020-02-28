import React from "react";

import { TextField, MenuItem, ListItemIcon } from "@material-ui/core";

import { FIELDS, FieldType } from "constants/fields";

/**
 * Returns dropdown component of all available types
 */
const FieldsDropdown = (value: FieldType | null, onChange: any) => {
  return (
    <TextField
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
};

export default FieldsDropdown;
