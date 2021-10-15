import { useState } from "react";
import _find from "lodash/find";
// import { useSnackbar } from "notistack";

import { makeStyles, createStyles } from "@mui/styles";
import {
  alpha,
  Grow,
  Paper,
  Grid,
  Tooltip,
  IconButton,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";

import CopyCellsIcon from "assets/icons/CopyCells";
import ClearSelectionIcon from "@mui/icons-material/IndeterminateCheckBox";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { useConfirmation } from "components/ConfirmationDialog/Context";
import { useProjectContext } from "contexts/ProjectContext";
import { formatPath } from "utils/fns";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "fixed",
      bottom: theme.spacing(2),
      left: "50%",
      transform: "translateX(-50%)",
    },

    paper: {
      height: 64,
      borderRadius: 32,
      padding: theme.spacing(0, 1),
      [theme.breakpoints.up("lg")]: { paddingRight: theme.spacing(2) },

      zIndex: theme.zIndex.modal,

      backgroundColor: theme.palette.background.default,

      width: 470,
      maxWidth: "100vw",
      overflowX: "auto",
    },

    grid: {
      height: "100%",
      marginTop: 0,
      marginBottom: 0,
    },
    spacer: { width: theme.spacing(2) },

    selectedContainer: {
      flexBasis: 206,
      flexShrink: 0,
    },
    selected: {
      color: theme.palette.text.disabled,
      fontFeatureSettings: '"tnum"',
      userSelect: "none",

      display: "inline-block",
      marginRight: theme.spacing(1),
      minWidth: 150,
    },

    dropdown: {
      minWidth: 120,
      margin: 0,
    },
    inputBaseRoot: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha(theme.palette.text.primary, 0.06)
          : undefined,
    },
    dropdownLabel: {
      left: theme.spacing(1.5),
      top: "50%",
      transform: "translateY(-50%) !important",

      ...theme.typography.body1,
    },
    dropdownLabelFocused: {
      "$dropdownLabel&": { color: theme.palette.text.primary },
    },
    select: {
      paddingTop: "6px !important",
      paddingBottom: "7px !important",
    },
    dropdownMenu: { marginTop: theme.spacing(-3) },
  })
);

export default function BulkActions({ selectedRows, columns, clearSelection }) {
  const classes = useStyles();
  const [, setLoading] = useState<Boolean>();
  const { tableActions, addRow, tableState } = useProjectContext();

  const { requestConfirmation } = useConfirmation();
  // const { enqueueSnackbar } = useSnackbar();

  const actionColumns: { name: string; key: string; config: any }[] = columns
    .filter((column) => column.type === "ACTION")
    .map((column) => ({
      name: column.name,
      key: column.key,
      config: column.config,
    }));

  const handleDuplicate = () => {
    selectedRows.forEach((row) => {
      const clonedRow = { ...row };
      // remove metadata
      delete clonedRow.ref;
      delete clonedRow.rowHeight;
      Object.keys(clonedRow).forEach((key) => {
        if (clonedRow[key] === undefined) delete clonedRow[key];
      });
      if (tableActions) addRow!(clonedRow);
    });
    clearSelection();
  };
  const handleDelete = () => {
    selectedRows.forEach((row) => row.ref.delete());
    clearSelection();
  };

  const executeAction = async (key: string, actionType: string) => {
    const actionColumn = _find(actionColumns, { key });
    if (!actionColumn) return;
    const callableName = actionColumn.config.callableName ?? "actionScript";

    const calls = selectedRows.map((row) => {
      const { ref } = row;
      const data = {
        ref: {
          path: ref.path,
          id: ref.id,
          tablePath: window.location.pathname,
        },
        column: actionColumn,
        action: actionType,
        schemaDocPath: formatPath(tableState?.tablePath ?? ""),
        actionParams: {},
      };
      return true;
      //   cloudFunction(
      //     callableName,
      //     data,
      //     async (response) => {
      //       const { message, cellValue, success } = response.data;
      //       // setIsRunning(false);
      //       enqueueSnackbar(JSON.stringify(message), {
      //         variant: success ? "success" : "error",
      //       });
      //       if (cellValue && cellValue.status) {
      //         return ref.update({ [actionColumn.key]: cellValue });
      //       }
      //     },
      //     (error) => {
      //       console.error("ERROR", callableName, error);
      //       //setIsRunning(false);
      //       enqueueSnackbar(JSON.stringify(error), { variant: "error" });
      //     }
      //   );
    });
    setLoading(true);
    const result = await Promise.all(calls);
    await Promise.all(result);
    console.log(result);
    setLoading(false);
    clearSelection();
  };

  const numSelected = selectedRows.length;

  return (
    <div className={classes.root}>
      <Grow in={numSelected > 0}>
        <Paper elevation={8} className={classes.paper}>
          <Grid
            container
            alignItems="center"
            wrap="nowrap"
            className={classes.grid}
          >
            <Grid item className={classes.selectedContainer}>
              <Tooltip title="Clear selection">
                <IconButton
                  color="secondary"
                  onClick={clearSelection}
                  aria-label="Clear selection"
                >
                  <ClearSelectionIcon />
                </IconButton>
              </Tooltip>

              <Typography variant="overline" className={classes.selected}>
                {numSelected} row{numSelected !== 1 && "s"} selected
              </Typography>
            </Grid>

            <Grid item className={classes.spacer} />

            <Grid item>
              <TextField
                select
                variant="filled"
                className={classes.dropdown}
                value=""
                onChange={(event) => executeAction(event.target.value, "run")}
                margin="dense"
                InputProps={{
                  disableUnderline: true,
                  classes: { root: classes.inputBaseRoot },
                }}
                InputLabelProps={{
                  classes: {
                    root: classes.dropdownLabel,
                    focused: classes.dropdownLabelFocused,
                  },
                }}
                SelectProps={{
                  classes: { root: classes.select },
                  displayEmpty: true,
                  MenuProps: {
                    anchorOrigin: { vertical: "top", horizontal: "left" },
                    transformOrigin: { vertical: "bottom", horizontal: "left" },
                    classes: { paper: classes.dropdownMenu },
                  },
                  IconComponent: ArrowDropUpIcon,
                }}
                label={`${actionColumns.length} action${
                  actionColumns.length !== 1 ? "s" : ""
                }`}
              >
                {actionColumns.map((action) => (
                  <MenuItem value={action.key} key={action.key}>
                    {action.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item className={classes.spacer} />

            <Grid item>
              <Tooltip title="Duplicate rows">
                <IconButton
                  color="secondary"
                  onClick={() => {
                    requestConfirmation({
                      title: "Duplicate rows?",
                      body: `Are you sure you want to duplicate the ${numSelected} selected row${
                        numSelected !== 1 ? "s" : ""
                      }?`,
                      confirm: "Duplicate rows",
                      handleConfirm: handleDuplicate,
                    });
                  }}
                  aria-label="Duplicate selected rows"
                >
                  <CopyCellsIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title="Delete rows">
                <IconButton
                  color="secondary"
                  onClick={() => {
                    requestConfirmation({
                      title: "Delete rows?",
                      body: `Are you sure you want to delete the ${numSelected} select row${
                        numSelected !== 1 ? "s" : ""
                      }?`,
                      confirm: "Delete rows",
                      handleConfirm: handleDelete,
                    });
                  }}
                  aria-label="Delete selected rows"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
      </Grow>
    </div>
  );
}
