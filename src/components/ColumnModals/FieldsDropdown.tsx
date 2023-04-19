import MultiSelect from "@rowy/multiselect";
import { Box, ListItemIcon, Typography } from "@mui/material";

import { FIELDS } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

import { useSetAtom, useAtom } from "jotai";
import {
  projectScope,
  projectSettingsAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";

export interface IFieldsDropdownProps {
  value: FieldType | "";
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
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const fieldTypesToDisplay = optionsProp
    ? FIELDS.filter((fieldConfig) => optionsProp.indexOf(fieldConfig.type) > -1)
    : FIELDS;
  const options = fieldTypesToDisplay.map((fieldConfig) => {
    const requireCloudFunctionSetup =
      fieldConfig.requireCloudFunction && !projectSettings.rowyRunUrl;
    const requireCollectionTable =
      tableSettings.isCollection === false &&
      fieldConfig.requireCollectionTable === true;
    return {
      label: fieldConfig.name,
      value: fieldConfig.type,
      disabled: requireCloudFunctionSetup || requireCollectionTable,
      requireCloudFunctionSetup,
      requireCollectionTable,
    };
  });

  return (
    <MultiSelect
      multiple={false}
      {...props}
      value={value ? value : ""}
      onChange={onChange}
      options={options}
      {...({
        AutocompleteProps: {
          groupBy: (option: typeof options[number]) =>
            getFieldProp("group", option.value),
          ListboxProps: {
            sx: {
              '& li.MuiAutocomplete-option[aria-disabled="true"]': {
                opacity: 1,
              },
              '& li.MuiAutocomplete-option[aria-disabled="true"] > *': {
                opacity: 0.4,
              },
              '& li.MuiAutocomplete-option[aria-disabled="true"] > .require-cloud-function':
                {
                  opacity: 1,
                },
            },
          },
        },
      } as any)}
      itemRenderer={(option) => (
        <>
          <ListItemIcon style={{ minWidth: 40 }}>
            {getFieldProp("icon", option.value as FieldType)}
          </ListItemIcon>
          <Typography>{option.label}</Typography>
          {option.requireCollectionTable ? (
            <Typography
              color="error"
              variant="inherit"
              component="span"
              marginLeft={1}
              className={"require-cloud-function"}
            >
              {" "}
              Unavailable
            </Typography>
          ) : option.requireCloudFunctionSetup ? (
            <Typography
              color="error"
              variant="inherit"
              component="span"
              marginLeft={1}
              className={"require-cloud-function"}
            >
              {" "}
              Requires
              <span
                style={{
                  marginLeft: "3px",
                  cursor: "pointer",
                  pointerEvents: "all",
                  textDecoration: "underline",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openRowyRunModal({ feature: option.label });
                }}
              >
                Cloud Function
              </span>
            </Typography>
          ) : null}
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
