import { IHeavyCellProps } from "../types";
import clsx from "clsx";
import _get from "lodash/get";

import { createStyles, makeStyles, Grid } from "@material-ui/core";

import ActionFab from "./ActionFab";
import { sanitiseCallableName, isUrl } from "utils/fns";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { padding: theme.spacing(0, 0.375, 0, 1.5) },
    labelContainer: { overflowX: "hidden" },
  })
);

export default function Action({
  column,
  row,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  const classes = useStyles();

  const hasRan = value && value.status;

  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      className={clsx("cell-collapse-padding", classes.root)}
    >
      <Grid item xs className={classes.labelContainer}>
        {hasRan && isUrl(value.status) ? (
          <a href={value.status} target="_blank" rel="noopener noreferrer">
            {value.status}
          </a>
        ) : hasRan ? (
          value.status
        ) : (
          sanitiseCallableName(column.key)
        )}
      </Grid>

      <Grid item>
        <ActionFab
          row={row}
          column={column}
          onSubmit={onSubmit}
          value={value}
          size="small"
          color="secondary"
          style={{ width: 36, height: 36 }}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
}
