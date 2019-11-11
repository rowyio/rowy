import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import FormatColorFillIcon from "@material-ui/icons/FormatColorFill";
import DeleteIcon from "@material-ui/icons/Delete";

import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles(Theme =>
  createStyles({
    container: {
      padding: 15,
    },
    typography: {
      padding: 1,
    },
    header: {
      position: "absolute",
      left: 0,
      top: 0,
    },
    button: {
      // margin: theme.spacing(1)
    },
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: Theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: Theme.spacing(2),
    },
    toggleGrouped: {
      margin: Theme.spacing(0.5),
      border: "none",
      padding: Theme.spacing(0, 1),
      "&:not(:first-child)": {
        borderRadius: Theme.shape.borderRadius,
      },
      "&:first-child": {
        borderRadius: Theme.shape.borderRadius,
      },
    },
  })
);

const ColumnEditor = (props: any) => {
  const { anchorEl, column, handleClose, actions } = props;

  const [values, setValues] = useState({
    type: null,
    name: "",
    options: [],
    collectionPath: "",
    config: {},
  });
  const [flags, setFlags] = useState(() => [""]);
  const classes = useStyles();

  function handleChange(
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) {
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
    });
  };
  const onClickAway = (event: any) => {
    const elementId = event.target.id;
    if (!elementId.includes("select")) {
      handleClose();
      clearValues();
    }
  };

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newFlags: string[]
  ) => {
    setFlags(newFlags);
  };

  const createNewColumn = () => {
    const { name, type, options, collectionPath, config } = values;

    actions.add(name, type, { options, collectionPath, config });

    handleClose();
    clearValues();
  };
  const deleteColumn = () => {
    actions.remove(props.column.idx);
    handleClose();
    clearValues();
  };

  const disableAdd = () => {
    const { type, name, options, collectionPath, config } = values;
    if (!type || name === "") return true;
    //TODO: Add more validation
    return false;
  };
  if (column) {
    return (
      <ClickAwayListener onClickAway={onClickAway}>
        <Popper
          className={classes.header}
          id={`id-${column.name}-filter`}
          open={!!anchorEl}
          anchorEl={anchorEl}
          placement={"bottom-end"}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper
                className={classes.container}
                style={{ minWidth: column.width ? column.width - 20 : 200 }}
              >
                <Grid container direction="column"></Grid>
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    );
  }
  return <div />;
};

export default ColumnEditor;
