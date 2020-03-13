import React from "react";
import clsx from "clsx";
import { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles, Tooltip, Fade } from "@material-ui/core";

import { useFiretableContext } from "contexts/firetableContext";

type StylesProps = { width: number; rowHeight: number };

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      padding: theme.spacing(0.5, 0),
      position: "absolute",
      top: 0,
      bottom: 0,
      right: theme.spacing(1.5),
      left: theme.spacing(1.5),

      "& .rendered-html": {
        maxHeight: "100%",
        whiteSpace: "normal",
      },
    },

    tooltip: ({ width, rowHeight }: StylesProps) => ({
      margin: `-${rowHeight - 1}px 0 0 -${theme.spacing(1.5)}px`,
      padding: theme.spacing(0.5, 1.5),

      width: width - 1,
      maxWidth: "none",
      minHeight: rowHeight - 1,
      overflowX: "hidden",

      background: theme.palette.background.paper,
      borderRadius: 0,
      boxShadow: theme.shadows[4],

      ...theme.typography.body2,
      fontSize: "0.75rem",
      color: theme.palette.text.primary,
      whiteSpace: "normal",

      display: "flex",
      alignItems: "center",
    }),
    tooltipHtml: { margin: 0 },
  })
);

export default function RichText({ column, value }: CustomCellProps) {
  const { tableState } = useFiretableContext();
  const classes = useStyles({
    width: column.width,
    rowHeight: tableState?.config?.rowHeight ?? 44,
  });

  return (
    <Tooltip
      title={
        <div
          dangerouslySetInnerHTML={{ __html: value }}
          className={clsx("rendered-html", classes.tooltipHtml)}
        />
      }
      enterDelay={1000}
      interactive
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
        <div
          dangerouslySetInnerHTML={{ __html: value }}
          className={"rendered-html"}
        />
      </div>
    </Tooltip>
  );
}
