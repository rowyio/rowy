import { useState } from "react";
import _find from "lodash/find";
import { useSnackbar } from "notistack";

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
  Button,
} from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import CopyCellsIcon from "@src/assets/icons/CopyCells";
import ClearSelectionIcon from "@mui/icons-material/IndeterminateCheckBox";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { useConfirmation } from "@src/components/ConfirmationDialog/Context";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { formatPath, asyncForEach } from "@src/utils/fns";
// import routes from "@src/constants/routes";
import { runRoutes } from "@src/constants/runRoutes";
// import { config } from "process";
import { WIKI_LINKS } from "@src/constants/externalLinks";

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

      ...theme.typography.body1,
    },
    dropdownLabelFocused: {
      "$dropdownLabel&": { color: theme.palette.text.primary },
    },
    select: {
      // paddingTop: "6px !important",
      // paddingBottom: "7px !important",
    },
    dropdownMenu: {
      // marginTop: theme.spacing(-3)
    },
  })
);

export default function BulkActions({ selectedRows, columns, clearSelection }) {
  const classes = useStyles();
  const [, setLoading] = useState<Boolean>();
  const {
    tableActions,
    addRow,
    tableState,
    deleteRow,
    rowyRun,
    compatibleRowyRunVersion,
  } = useProjectContext();

  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();

  const actionColumns: { name: string; key: string; config: any }[] = columns
    .filter((column) => column.type === "ACTION")
    .map((column) => ({
      name: column.name,
      key: column.key,
      config: column.config,
    }));

  const handleDuplicate = () => {
    asyncForEach(selectedRows, async (row) => {
      const clonedRow = { ...row };
      // remove metadata
      delete clonedRow.ref;
      delete clonedRow.rowHeight;
      Object.keys(clonedRow).forEach((key) => {
        if (clonedRow[key] === undefined) delete clonedRow[key];
      });
      await addRow!(clonedRow, undefined, { type: "smaller" });
      //sleep 1 sec
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    clearSelection();
  };
  const handleDelete = () => {
    deleteRow!(selectedRows.map((row) => row.ref));
    clearSelection();
  };

  const handleActionScript = async (actionColumn, actionType) => {
    const requiredVersion = "1.2.0";
    if (!compatibleRowyRunVersion!({ minVersion: requiredVersion })) {
      enqueueSnackbar(
        `Upgrade your Rowy run to ${requiredVersion} or above, to run bulk actions`,
        {
          variant: "warning",
          action: (
            <Button
              href={WIKI_LINKS.rowyRun}
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
              <InlineOpenInNewIcon />
            </Button>
          ),
        }
      );
      return;
    }
    const refs = selectedRows.map((row) => {
      const { ref } = row;
      return {
        path: ref.path,
        id: ref.id,
        tablePath: window.location.pathname,
      };
    });
    const data = {
      refs,
      column: actionColumn,
      action: actionType,
      schemaDocPath: formatPath(tableState?.config.id ?? ""),
      actionParams: {},
    };
    setLoading(true);
    const result = await rowyRun!({
      route: runRoutes.actionScript,
      body: data,
    });
    Array.isArray(result)
      ? result.map((res) =>
          enqueueSnackbar(res.message, {
            variant: res.success ? "success" : "error",
          })
        )
      : enqueueSnackbar(result.message, {
          variant: result.success ? "success" : "error",
        });
    setLoading(false);
    clearSelection();
  };
  const executeAction = async (key: string, actionType: string) => {
    const actionColumn = _find(actionColumns, { key });
    if (!actionColumn) return;
    if (actionColumn.config.isActionScript) {
      handleActionScript(actionColumn, actionType);
    } else {
      enqueueSnackbar("Callable actions not implemented yet", {
        variant: "warning",
      });
    }
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
              {/* <Typography>
                {`${actionColumns.length} action${
                  actionColumns.length !== 1 ? "s" : ""
                }`}
              </Typography> */}
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
                  classes: { select: classes.select },
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
