import React from "react";
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

import Confirmation from "components/Confirmation";
import { useFiretableContext } from "contexts/firetableContext";
import useKeyPress from "../../../hooks/useKeyPress";
export const useFinalColumnStyles = makeStyles(theme =>
  createStyles({
    headerCell: {
      ".rdg-root &": {
        width: "46px !important",
        overflow: "visible",

        "& > div": {
          position: "absolute",
          right: "-50%",
        },
      },
    },

    cell: {
      ".rdg-root .rdg-cell&": {
        background: theme.palette.background.default,
        borderColor: "transparent",

        color: theme.palette.text.disabled,
        transition: theme.transitions.create("color", {
          duration: theme.transitions.duration.shortest,
        }),
      },

      ".rdg-row:hover &": { color: theme.palette.text.primary },
    },
  })
);

export default function FinalColumn({ row }: FormatterProps<any, any, any>) {
  const { tableActions } = useFiretableContext();
  const shiftPress = useKeyPress("Shift");

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
          <span>
            {shiftPress ? (
              <IconButton
                size="small"
                color="inherit"
                onClick={async () => {
                  row.ref.delete();
                }}
                aria-label="Delete row"
              >
                <DeleteIcon />
              </IconButton>
            ) : (
              <Confirmation
                message={{
                  title: "Delete Row",
                  body: "Are you sure you want to delete this row?",
                  confirm: "Delete",
                }}
              >
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={async () => {
                    row.ref.delete();
                  }}
                  aria-label="Delete row"
                >
                  <DeleteIcon />
                </IconButton>
              </Confirmation>
            )}
          </span>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
