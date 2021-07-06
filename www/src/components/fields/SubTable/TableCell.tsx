import { IHeavyCellProps } from "../types";
import clsx from "clsx";
import { Link } from "react-router-dom";

import { createStyles, makeStyles, Grid, IconButton } from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";

import { useSubTableData } from "./utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { padding: theme.spacing(0, 0.625, 0, 1) },
    labelContainer: { overflowX: "hidden" },
  })
);

export default function SubTable({ column, row }: IHeavyCellProps) {
  const classes = useStyles();
  const { documentCount, label, subTablePath } = useSubTableData(
    column,
    row,
    row.ref
  );

  if (!row.ref) return null;

  return (
    <Grid
      container
      wrap="nowrap"
      alignItems="center"
      spacing={1}
      className={clsx("cell-collapse-padding", classes.root)}
    >
      <Grid item xs className={classes.labelContainer}>
        {documentCount} {column.name}: {label}
      </Grid>

      <Grid item>
        <IconButton
          component={Link}
          to={subTablePath}
          className="row-hover-iconButton"
          size="small"
          disabled={!subTablePath}
        >
          <LaunchIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
