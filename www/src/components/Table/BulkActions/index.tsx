import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CopyCellsIcon from "assets/icons/CopyCells";
import ClearSelectionIcon from "@material-ui/icons/IndeterminateCheckBox";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import { useConfirmation } from "components/ConfirmationDialog/Context";
import { useFiretableContext } from "contexts/firetableContext";
import _find from "lodash/find";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      bottom: 10,
      right: 50,
    },
    paper: {
      padding: theme.spacing(2),
      cornerRadius: 32,
    },
  })
);

export default function BulkActions({ selectedRows, clearSelection }) {
  const { requestConfirmation } = useConfirmation();
  const { tableActions } = useFiretableContext();
  const classes = useStyles();

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
  const numberOfSelectedRows = selectedRows.length;
  if (numberOfSelectedRows === 0) return null;
  return (
    <div className={classes.root}>
      <Paper elevation={5} className={classes.paper}>
        <>
          <IconButton
            size="medium"
            color="inherit"
            onClick={clearSelection}
            aria-label="Duplicate selected rows"
          >
            <ClearSelectionIcon />
          </IconButton>
          <Typography variant="overline">
            {" "}
            {numberOfSelectedRows} rows selected{" "}
          </Typography>

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
        </>
      </Paper>
    </div>
  );
}
