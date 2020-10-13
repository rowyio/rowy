import React, { useContext } from "react";
import { FormatterProps } from "react-data-grid";

import {
  makeStyles,
  createStyles,
  Grid,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import CopyCellsIcon from "assets/icons/CopyCells";
import DeleteIcon from "@material-ui/icons/Cancel";
import { SnackContext } from "../../../contexts/snackContext";
import { useConfirmation } from "components/ConfirmationDialog/Context";
import { useFiretableContext } from "contexts/firetableContext";
import useKeyPress from "../../../hooks/useKeyPress";
export const useFinalColumnStyles = makeStyles((theme) =>
  createStyles({
    cell: {
      ".rdg-root .rdg-cell&": {
        background: theme.palette.background.default,
        borderWidth: 0,

        color: theme.palette.text.disabled,
        transition: theme.transitions.create("color", {
          duration: theme.transitions.duration.shortest,
        }),
      },

      ".rdg-row:hover &": { color: theme.palette.text.primary },

      ".rdg-header-row &": {
        width: "46px !important",
        overflow: "visible",
        borderWidth: "1px !important",

        "& > div": {
          position: "absolute",
          right: "-50%",
        },
      },
    },
  })
);

export default function FinalColumn({ row }: FormatterProps<any, any, any>) {
  const { requestConfirmation } = useConfirmation();
  const { tableActions } = useFiretableContext();
  const shiftPress = useKeyPress("Shift");
  const snack = useContext(SnackContext);

  const handleDelete = async () => {
    row.ref.delete().then(
      (r) => {
        console.log("r", r);
      },
      (error) => {
        if (error.code === "permission-denied") {
          snack.open({
            severity: "error",
            message: "You don't have permissions to delete this row",
            duration: 3000,
            position: { vertical: "top", horizontal: "center" },
          });
        }
      }
    );
  };
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
              delete clonedRow._ft_updatedAt;
              delete clonedRow._ft_updatedBy;
              delete clonedRow._ft_createdAt;
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
          <>
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
          </>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
