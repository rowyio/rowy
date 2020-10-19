import React from "react";

import {
  makeStyles,
  createStyles,
  TextField,
  MenuItem,
  ListItemIcon,
  TextFieldProps,
} from "@material-ui/core";

import { FIELDS, FieldType, FIELD_TYPE_DESCRIPTIONS } from "constants/fields";

const useStyles = makeStyles((theme) =>
  createStyles({
    helperText: {
      ...theme.typography.body2,
      marginTop: theme.spacing(1),
    },

    listItemIcon: {
      verticalAlign: "text-bottom",
      minWidth: theme.spacing(5),
    },
  })
);

export interface IFieldsDropdownProps {
  value: FieldType;
  onChange: TextFieldProps["onChange"];
  className?: string;
  hideLabel?: boolean;
  options?: FieldType[];
}

/**
 * Returns dropdown component of all available types
 */
export default function FieldsDropdown({
  value,
  onChange,
  className,
  hideLabel = false,
  options: optionsProp,
}: IFieldsDropdownProps) {
  const classes = useStyles();

  const options = optionsProp
    ? FIELDS.filter((field) => optionsProp.indexOf(field.type) > -1)
    : FIELDS;

  return (
    <TextField
      fullWidth
      select
      value={value ? value : ""}
      onChange={onChange}
      inputProps={{ name: "type", id: "type" }}
      label={!hideLabel ? "Field Type" : ""}
      aria-label="Field Type"
      hiddenLabel={hideLabel}
      helperText={value && FIELD_TYPE_DESCRIPTIONS[value]}
      FormHelperTextProps={{ classes: { root: classes.helperText } }}
      className={className}
    >
      {options.map((field) => (
        <MenuItem
          key={`select-field-${field.name}`}
          id={`select-field-${field.type}`}
          value={field.type}
        >
          <ListItemIcon className={classes.listItemIcon}>
            {field.icon}
          </ListItemIcon>
          {field.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
