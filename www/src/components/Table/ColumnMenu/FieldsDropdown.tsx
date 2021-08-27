import { makeStyles, createStyles } from "@material-ui/styles";
import {
  TextField,
  MenuItem,
  ListItemIcon,
  TextFieldProps,
} from "@material-ui/core";

import { FIELDS } from "components/fields";
import { FieldType } from "constants/fields";
import { getFieldProp } from "components/fields";

const useStyles = makeStyles((theme) =>
  createStyles({
    helperText: {
      ...theme.typography.body2,
      marginTop: theme.spacing(1),
    },

    listItemIcon: {
      verticalAlign: "text-bottom",
      minWidth: theme.spacing(5),
      "& svg": { margin: theme.spacing(-0.5, 0) },
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
    ? FIELDS.filter((fieldConfig) => optionsProp.indexOf(fieldConfig.type) > -1)
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
      helperText={value && getFieldProp("description", value)}
      FormHelperTextProps={{ classes: { root: classes.helperText } }}
      className={className}
    >
      {options.map((fieldConfig) => (
        <MenuItem
          key={`select-field-${fieldConfig.type}`}
          id={`select-field-${fieldConfig.type}`}
          value={fieldConfig.type}
        >
          <ListItemIcon className={classes.listItemIcon}>
            {fieldConfig.icon}
          </ListItemIcon>
          {fieldConfig.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
