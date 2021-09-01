import { useContext } from "react";
import { FormatterProps } from "react-data-grid";

import { makeStyles, createStyles } from "@material-ui/styles";
import { Grid, Tooltip, IconButton } from "@material-ui/core";
import CopyCellsIcon from "assets/icons/CopyCells";
import DeleteIcon from "@material-ui/icons/DeleteForever";

import { SnackContext } from "contexts/SnackContext";
import { useConfirmation } from "components/ConfirmationDialog/Context";
import { useRowyContext } from "contexts/RowyContext";
import useKeyPress from "hooks/useKeyPress";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".final-column-cell": {
        ".rdg .rdg-cell&": {
          backgroundColor: "var(--header-background-color)",
          borderColor: "var(--header-background-color)",
          color: theme.palette.text.disabled,
        },

        ".rdg-row:hover &": { color: theme.palette.text.primary },
      },
    },
  })
);

export default function FinalColumn({ row }: FormatterProps<any, any>) {
  useStyles();

  const { requestConfirmation } = useConfirmation();
  const { tableActions } = useRowyContext();
  const shiftPress = useKeyPress("Shift");
  const snack = useContext(SnackContext);

  const handleDelete = async () => tableActions?.row.delete(row.id);
  return (
    <Grid container spacing={1}>
      <Grid item>
        <Tooltip title="Duplicate row">
          <IconButton
            size="small"
            color="inherit"
            onClick={() => {
              const clonedRow = { ...row };
              // remove metadata
              delete clonedRow.ref;
              delete clonedRow.rowHeight;
              delete clonedRow._updatedAt;
              delete clonedRow._updatedBy;
              delete clonedRow._createdAt;
              Object.keys(clonedRow).forEach((key) => {
                if (clonedRow[key] === undefined) {
                  delete clonedRow[key];
                }
              });
              if (tableActions) tableActions?.row.add(clonedRow);
            }}
            aria-label="Duplicate row"
          >
            <CopyCellsIcon />
          </IconButton>
        </Tooltip>
      </Grid>

      <Grid item>
        <Tooltip title="Delete row">
          {shiftPress ? (
            <IconButton
              size="small"
              color="inherit"
              onClick={handleDelete}
              aria-label="Delete row"
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            // <Confirmation
            //   message={{
            //     title: "Delete Row",
            //     body: "Are you sure you want to delete this row?",
            //     confirm: "Delete",
            //   }}
            // >
            <IconButton
              size="small"
              color="inherit"
              onClick={() => {
                requestConfirmation({
                  title: "Delete Row",
                  body: "Are you sure you want to delete this row?",
                  confirm: "Delete",
                  handleConfirm: handleDelete,
                });
              }}
              aria-label="Delete row"
            >
              <DeleteIcon />
            </IconButton>
            // </Confirmation>
          )}
        </Tooltip>
      </Grid>
    </Grid>
  );
}
