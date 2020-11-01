import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CopyCellsIcon from "assets/icons/CopyCells";
import ClearSelectionIcon from "@material-ui/icons/IndeterminateCheckBox";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import DropdownIcon from "@material-ui/icons/ArrowDropDown";
import { useConfirmation } from "components/ConfirmationDialog/Context";
import { useFiretableContext } from "contexts/firetableContext";
import { useSnackContext } from "contexts/snackContext";
import { sanitiseRowData } from "utils/fns";
import { formatPath, asyncForEach } from "../../../utils/fns";
import { cloudFunction } from "firebase/callables";
import _find from "lodash/find";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      bottom: 10,
      right: 30,
    },
    paper: {
      padding: theme.spacing(2),

      cornerRadius: 32,
    },
  })
);

export default function BulkActions({ selectedRows, columns, clearSelection }) {
  const { requestConfirmation } = useConfirmation();
  const { tableActions, tableState } = useFiretableContext();
  const snack = useSnackContext();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const actionColumns = columns
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
      delete clonedRow._ft_updatedAt;
      delete clonedRow._ft_updatedBy;
      delete clonedRow._ft_createdAt;
      Object.keys(clonedRow).forEach((key) => {
        if (clonedRow[key] === undefined) {
          delete clonedRow[key];
        }
      });
      if (tableActions) tableActions?.row.add(clonedRow);
    });
    clearSelection();
  };
  const handleDelete = () => {
    selectedRows.forEach((row) => row.ref.delete());
    clearSelection();
  };

  const executeAction = async (actionColumn, actionType) => {
    console.log({ actionColumn, selectedRows, actionType });
    const callableName = actionColumn.config.callableName ?? "actionScript";

    await asyncForEach(selectedRows, async (row) => {
      const { ref, ..._rowData } = row;
      const rowData = sanitiseRowData(Object.assign({}, _rowData));
      const data = {
        ref: {
          path: ref.path,
          id: ref.id,
          tablePath: window.location.pathname,
        },
        row: rowData,
        column: actionColumn,
        action: actionType,
        schemaDocPath: formatPath(tableState?.tablePath ?? ""),
        actionParams: {},
      };
      await cloudFunction(
        callableName,
        data,
        (response) => {
          const { message, cellValue, success } = response.data;
          // setIsRunning(false);
          snack.open({
            message: JSON.stringify(message),
            severity: success ? "success" : "error",
          });
          // if (cellValue && cellValue.status) onSubmit(cellValue);
        },
        (error) => {
          console.error("ERROR", callableName, error);
          //setIsRunning(false);
          //snack.open({ message: JSON.stringify(error), severity: "error" });
        }
      );
    });
  };
  const numberOfSelectedRows = selectedRows.length;
  if (numberOfSelectedRows === 0) return null;
  return (
    <div className={classes.root}>
      <Paper elevation={5} className={classes.paper}>
        <Grid direction="row" container alignItems="center">
          <IconButton
            size="medium"
            color="inherit"
            onClick={clearSelection}
            aria-label="Duplicate selected rows"
          >
            <ClearSelectionIcon />
          </IconButton>
          <Typography variant="overline">
            {numberOfSelectedRows} rows selected
          </Typography>

          <Grid item>
            <div>
              <Button
                color="inherit"
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                {actionColumns.length} actions <DropdownIcon />
              </Button>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDown}
                        >
                          {actionColumns.map((action) => (
                            <MenuItem
                              onClick={(e) => {
                                executeAction(action, "run");
                                handleClose(e);
                              }}
                            >
                              {action.name}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </Grid>

          <IconButton
            size="medium"
            color="inherit"
            onClick={() => {
              requestConfirmation({
                title: "Duplicate Rows",
                body: `Are you sure you want to create duplicate of the ${numberOfSelectedRows} select rows?`,
                confirm: "Duplicate",
                handleConfirm: handleDuplicate,
              });
            }}
            aria-label="Duplicate selected rows"
          >
            <CopyCellsIcon />
          </IconButton>

          <IconButton
            size="medium"
            color="inherit"
            onClick={() => {
              requestConfirmation({
                title: "Delete Rows",
                body: `Are you sure you want to delete the ${numberOfSelectedRows} select rows?`,
                confirm: "Delete",
                handleConfirm: handleDelete,
              });
            }}
            aria-label="Delete selected rows"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Paper>
    </div>
  );
}
