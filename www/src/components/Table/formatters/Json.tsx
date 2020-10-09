import React from "react";
import { CustomCellProps } from "./withCustomCell";
import jsonFormat from "json-format";

import { makeStyles, createStyles, Tooltip, Fade } from "@material-ui/core";

import { useFiretableContext } from "contexts/firetableContext";

import { MONO_FONT } from "Theme";

type StylesProps = { width: number; rowHeight: number };

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      whiteSpace: "pre-line",
      padding: theme.spacing(0.5, 0),

      display: "flex",
      alignItems: "center",

      position: "absolute",
      top: 0,
      bottom: 0,
      right: theme.spacing(1.5),
      left: theme.spacing(1.5),
    },
    text: {
      maxHeight: "100%",
      fontFamily: MONO_FONT,
      wordBreak: "break-word",
      whiteSpace: "pre-wrap",
    },

    tooltip: ({ width, rowHeight }: StylesProps) => ({
      margin: `-${rowHeight - 1}px 0 0 -${theme.spacing(1.5)}px`,
      padding: theme.spacing(0.5, 1.5),

      width: width - 1,
      maxWidth: "none",
      minHeight: rowHeight - 1,
      overflowX: "scroll",

      background: theme.palette.background.paper,
      borderRadius: 0,
      boxShadow: theme.shadows[4],

      ...theme.typography.body2,
      fontSize: "0.75rem",
      color: theme.palette.text.primary,
      fontFamily: MONO_FONT,
      wordBreak: "break-word",
      whiteSpace: "pre-wrap",

      display: "flex",
      alignItems: "center",
    }),
  })
);

export default function LongText({ column, value }: CustomCellProps) {
  const { tableState } = useFiretableContext();
  const classes = useStyles({
    width: column.width,
    rowHeight: tableState?.config?.rowHeight ?? 44,
  });

  if (!value) return <div />;

  const formattedJson = jsonFormat(value, {
    type: "space",
    char: " ",
    size: 2,
  });

  return (
    <Tooltip
      title={formattedJson}
      enterDelay={1000}
      interactive
      onClick={(e) => e.stopPropagation()}
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
        <pre className={classes.text}>{formattedJson}</pre>
      </div>
    </Tooltip>
  );
}
