import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import FieldsDropdown from "./FieldsDropdown";
import { FieldType } from "constants/fields";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import FormatColorFillIcon from "@material-ui/icons/FormatColorFill";
import DeleteIcon from "@material-ui/icons/Delete";
import SelectOptionsInput from "./SelectOptionsInput";

import DocInput from "./DocInput";
import { Tooltip } from "@material-ui/core";
import Confirmation from "../../Confirmation";

import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      padding: 15,
    },
    typography: {
      padding: 1,
    },

    button: {
      // margin: theme.spacing(1)
    },
    root: {
      padding: 10,
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    toggleGrouped: {
      margin: theme.spacing(0.5),
      border: "none",
      padding: theme.spacing(0, 1),
      "&:not(:first-child)": {
        borderRadius: theme.shape.borderRadius,
      },
      "&:first-child": {
        borderRadius: theme.shape.borderRadius,
      },
    },
  })
);

export default function ColumnEditor() {
  const {
    tableActions,
    selectedColumnHeader,
    setSelectedColumnHeader,
  } = useFiretableContext();
  const actions = tableActions!.column;
  const { column, anchorEl } = selectedColumnHeader ?? {};

  const handleClose = () => {
    if (setSelectedColumnHeader) setSelectedColumnHeader(null);
  };

  const [values, setValues] = useState({
    type: null,
    name: "",
    options: [],
    collectionPath: "",
    config: {},
    parentLabel: "",
    callableName: "",
  });
  const [flags, setFlags] = useState(() => [""]);
  const classes = useStyles();

  function handleChange(
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) {
    event.stopPropagation();
    event.preventDefault();
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name as string]: event.target.value,
    }));
  }
  const setValue = (key: string, value: any) => {
    setValues(oldValues => ({
      ...oldValues,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (column && !column.isNew) {
      setValues(oldValues => ({
        ...oldValues,
        name: column.name,
        type: column.type,
        key: column.key,
        isNew: column.isNew,
      }));
      if (column.options) {
        setValue("options", column.options);
      } else {
        setValue("options", []);
      }
      if (column.collectionPath) {
        setValue("collectionPath", column.collectionPath);
      }
      ["resizable", "editable", "fixed", "hidden"].map(flag => {
        if (column[flag]) {
          setFlags([...flags, flag]);
        }
      });
    }
  }, [column]);
  const clearValues = () => {
    setValues({
      type: null,
      name: "",
      options: [],
      collectionPath: "",
      config: {},
      parentLabel: "",
      callableName: "",
    });
  };
  const onClose = (event: any) => {
    handleClose();
    clearValues();
  };

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newFlags: string[]
  ) => {
    setFlags(newFlags);
  };

  const createNewColumn = () => {
    const { name, type, options, collectionPath, config, parentLabel } = values;

    actions.add(name, type, { options, collectionPath, config, parentLabel });

    handleClose();
    clearValues();
  };
  const deleteColumn = () => {
    actions.remove(column?.idx);
    handleClose();
    clearValues();
  };

  const updateColumn = () => {
    let updatables: { field: string; value: any }[] = [
      { field: "name", value: values.name },
      { field: "type", value: values.type },
      { field: "resizable", value: flags.includes("resizable") },
      { field: "editable", value: flags.includes("editable") },
      { field: "hidden", value: flags.includes("hidden") },
      { field: "fixed", value: flags.includes("fixed") },
    ];
    if (
      values.type === FieldType.multiSelect ||
      values.type === FieldType.singleSelect
    ) {
      updatables.push({
        field: "options",
        value: values.options,
      });
    }
    if (values.type === FieldType.connectTable) {
      updatables.push({
        field: "collectionPath",
        value: values.collectionPath,
      });
      updatables.push({
        field: "config",
        value: values.config,
      });
    }
    if (values.type === FieldType.subTable) {
      updatables.push({ field: "parentLabel", value: values.parentLabel });
    }
    if (values.type === FieldType.action) {
      updatables.push({ field: "callableName", value: values.callableName });
    }
    actions.update(column?.idx, updatables);
    handleClose();
    clearValues();
  };

  const disableAdd = () => {
    const { type, name, options, collectionPath, config } = values;
    if (!type || name === "") return true;
    //TODO: Add more validation
    return false;
  };

  if (column)
    return (
      <Popover
        className={classes.root}
        id={`id-${column.name}`}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={onClose}
      >
        <Grid container className={classes.container} direction="column">
          <ToggleButtonGroup
            size="small"
            value={flags}
            className={classes.toggleGrouped}
            onChange={handleToggle}
            arial-label="column settings"
          >
            <Tooltip title="Editable Cells">
              <ToggleButton value="editable" aria-label="editable">
                {flags.includes("editable") ? <LockOpenIcon /> : <LockIcon />}
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Hide Column">
              <ToggleButton value="visible" aria-label="visible">
                {flags.includes("visible") ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Fixed Column">
              <ToggleButton value="fixed" aria-label="fixed">
                <FormatUnderlinedIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Resizable column">
              <ToggleButton value="resizable" aria-label="resizable">
                <FormatColorFillIcon />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
          <TextField
            label="Column name"
            name="name"
            defaultValue={values.name}
            onChange={e => {
              setValue("name", e.target.value);
            }}
          />
          <FormControl className={classes.formControl}>
            {FieldsDropdown(values.type, handleChange)}

            {(values.type === FieldType.singleSelect ||
              values.type === FieldType.multiSelect) && (
              <SelectOptionsInput
                setValue={setValue}
                options={values.options}
              />
            )}
            {values.type === FieldType.connectTable && (
              <DocInput
                setValue={setValue}
                collectionPath={values.collectionPath}
              />
            )}
            {values.type === FieldType.subTable && (
              <TextField
                label={"Parent Label"}
                onChange={e => {
                  setValue("parentLabel", e.target.value);
                }}
              />
            )}
            {values.type === FieldType.action && (
              <TextField
                label={"Callable Name"}
                onChange={e => {
                  setValue("callableName", e.target.value);
                }}
              />
            )}
            <Grid container>
              <Grid item xs={6}>
                {column.isNew ? (
                  <Button
                    onClick={createNewColumn}
                    disabled={disableAdd()}
                    fullWidth
                  >
                    Add
                  </Button>
                ) : (
                  <Button
                    disabled={disableAdd()}
                    onClick={updateColumn}
                    fullWidth
                  >
                    update
                  </Button>
                )}
              </Grid>

              {!column.isNew && (
                <Grid item xs={6}>
                  <Confirmation
                    message={{
                      customBody:
                        "Are you sure you want to delete this nice column?",
                    }}
                  >
                    <Button onClick={deleteColumn} fullWidth>
                      Delete
                    </Button>
                  </Confirmation>
                </Grid>
              )}
            </Grid>
          </FormControl>
        </Grid>
      </Popover>
    );

  return null;
}
