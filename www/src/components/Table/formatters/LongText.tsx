import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles, Tooltip, Fade } from "@material-ui/core";

import { useFiretableContext } from "contexts/firetableContext";

type StylesProps = { width: number; rowHeight: number };

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      whiteSpace: "pre-line",
      padding: theme.spacing(0.5, 0),

      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
    },
    text: { maxHeight: "100%" },

    tooltip: ({ width, rowHeight }: StylesProps) => ({
      margin: `-${rowHeight - 1}px 0 0 -${theme.spacing(1.5)}px`,
      padding: theme.spacing(0.5, 1.5),

      width: width - 1,
      maxWidth: "none",
      minHeight: rowHeight - 1,

      background: theme.palette.background.paper,
      borderRadius: 0,
      boxShadow: theme.shadows[4],

      ...theme.typography.body2,
      fontSize: "0.75rem",
      color: theme.palette.text.primary,
      whiteSpace: "pre-line",

      display: "flex",
      alignItems: "center",
    }),
  })
);

function LongText({ column, value }: CustomCellProps) {
  const { tableState } = useFiretableContext();
  const classes = useStyles({
    width: column.width,
    rowHeight: tableState?.config?.rowHeight ?? 44,
  });

  if (!value || value === "") return <div />;

  return (
    <Tooltip
      title={value}
      enterDelay={1000}
      placement="bottom-start"
      PopperProps={{
        modifiers: {
          flip: { enabled: false },
          preventOverflow: {
            enabled: false,
            boundariesElement: "scrollParent",
          },
          hide: { enabled: false },
        },
      }}
      TransitionComponent={Fade}
      classes={{ tooltip: classes.tooltip }}
    >
      <div className={classes.root}>
        <span className={classes.text}>{value}</span>
      </div>
    </Tooltip>
  );
}

export default withCustomCell(LongText);
