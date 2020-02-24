import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";
import clsx from "clsx";

import { Link } from "react-router-dom";
import queryString from "query-string";
import useRouter from "hooks/useRouter";

import { createStyles, makeStyles, Grid, IconButton } from "@material-ui/core";
import OpenIcon from "@material-ui/icons/OpenInNew";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { padding: theme.spacing(0, 0.625, 0, 1) },
    labelContainer: { overflowX: "hidden" },
  })
);

function SubTable({ column, row }: CustomCellProps) {
  const classes = useStyles();

  const { parentLabel } = column as any;
  const fieldName = column.key;

  const router = useRouter();
  const parentLabels = queryString.parse(router.location.search).parentLabel;

  let subTablePath = "";
  if (parentLabels)
    subTablePath =
      encodeURIComponent(`${row.ref.path}/${fieldName}`) +
      `?parentLabel=${parentLabels},${row[parentLabel]}`;
  else
    subTablePath =
      encodeURIComponent(`${row.ref.path}/${fieldName}`) +
      `?parentLabel=${row[parentLabel]}`;

  return (
    <Grid
      container
      wrap="nowrap"
      alignItems="center"
      spacing={1}
      className={clsx("cell-collapse-padding", classes.root)}
    >
      <Grid item xs className={classes.labelContainer}>
        {column.name}: {row[parentLabel]}
      </Grid>

      <Grid item>
        <IconButton
          component={Link}
          to={subTablePath}
          className="row-hover-iconButton"
          size="small"
        >
          <OpenIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default withCustomCell(SubTable);
