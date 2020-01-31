import React from "react";

import { Select, MenuItem } from "@material-ui/core";

import { FIELDS, FieldType } from "constants/fields";

/**
 * Returns dropdown component of all available types
 */
const FieldsDropdown = (value: FieldType | null, onChange: any) => {
  return (
    <Select
      value={value ? value : ""}
      onChange={onChange}
      inputProps={{
        name: "type",
        id: "type",
      }}
    >
      {FIELDS.map(
        (field: { icon: JSX.Element; name: string; type: FieldType }) => {
          return (
            <MenuItem
              key={`select-field-${field.name}`}
              id={`select-field-${field.type}`}
              value={field.type}
            >
              <>{field.name}</>
            </MenuItem>
          );
        }
      )}
    </Select>
  );
};

export default FieldsDropdown;
