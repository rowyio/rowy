import React, { useContext } from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";
import clsx from "clsx";

import { createStyles, makeStyles, Grid, IconButton } from "@material-ui/core";
import PlayIcon from "@material-ui/icons/PlayCircleOutline";
import ReplayIcon from "@material-ui/icons/Replay";

import { SnackContext } from "contexts/snackContext";
import { cloudFunction } from "firebase/callables";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { padding: theme.spacing(0, 0.625, 0, 1) },
  })
);

function Action({ column, row, value, onSubmit }: CustomCellProps) {
  const classes = useStyles();

  const { createdAt, updatedAt, rowHeight, id, ref, ...docData } = row;
  const { callableName } = column as any;

  const snack = useContext(SnackContext);
  const handleRun = () => {
    // eval(scripts.onClick)(row);
    const cleanRow = Object.keys(row).reduce((acc: any, key: string) => {
      if (row[key]) return { ...acc, [key]: row[key] };
      else return acc;
    }, {});
    cleanRow.ref = "cleanRow.ref";
    delete cleanRow.rowHeight;
    delete cleanRow.updatedFields;
    cloudFunction(
      callableName,
      {
        ref: {
          path: ref.path,
          id: ref.id,
        },
        row: docData,
      },
      response => {
        const { message, cellValue } = response.data;
        snack.open({ message, severity: "success" });
        if (cellValue) {
          onSubmit(cellValue);
        }
      },
      o => snack.open({ message: JSON.stringify(o), severity: "error" })
    );
  };

  const hasRan = value && value.status;

  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      spacing={1}
      className={clsx("cell-collapse-padding", classes.root)}
    >
      <Grid item xs>
        {hasRan
          ? value.status
          : callableName?.replace("callable-", "").replace(/([A-Z])/g, " $1")}
      </Grid>

      <Grid item>
        <IconButton
          size="small"
          onClick={handleRun}
          disabled={hasRan && !value.redo}
          className={hasRan && !value.redo ? "" : "row-hover-iconButton"}
        >
          {hasRan ? <ReplayIcon /> : <PlayIcon />}
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default withCustomCell(Action);
