import {
  makeStyles,
  createStyles,
  TextField,
  MenuItem,
  ListItemIcon,
  TextFieldProps,
} from "@material-ui/core";

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
    ? Object.values(FieldType).filter(
        (fieldType) => optionsProp.indexOf(fieldType) > -1
      )
    : Object.values(FieldType);

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
      {options.map((fieldType) => (
        <MenuItem
          key={`select-field-${getFieldProp("name", fieldType)}`}
          id={`select-field-${fieldType}`}
          value={fieldType}
        >
          <ListItemIcon className={classes.listItemIcon}>
            {getFieldProp("icon", fieldType)}
          </ListItemIcon>
          {getFieldProp("name", fieldType)}
        </MenuItem>
      ))}
    </TextField>
  );
}
