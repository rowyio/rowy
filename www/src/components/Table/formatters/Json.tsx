import React from "react";
import { CustomCellProps } from "./withCustomCell";
import jsonFormat from "json-format";

import {
  makeStyles,
  createStyles,
  // Tooltip, Fade
} from "@material-ui/core";

// import { useFiretableContext } from "contexts/FiretableContext";

// type StylesProps = { width: number; rowHeight: number };

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      maxHeight: "100%",
      padding: theme.spacing(0.5, 0),

      whiteSpace: "pre-line",
      lineHeight: theme.typography.body2.lineHeight,
      fontFamily: theme.typography.fontFamilyMono,
      wordBreak: "break-word",
    },

    // tooltip: ({ width, rowHeight }: StylesProps) => ({
    //   margin: `-${rowHeight - 1}px 0 0 -${theme.spacing(1.5)}px`,
    //   padding: theme.spacing(0.5, 1.5),

    //   width: width - 1,
    //   maxWidth: "none",
    //   minHeight: rowHeight - 1,
    //   overflowX: "scroll",

    //   background: theme.palette.background.paper,
    //   borderRadius: 0,
    //   boxShadow: theme.shadows[4],

    //   ...theme.typography.body2,
    //   fontSize: "0.75rem",
    //   color: theme.palette.text.primary,
    //   fontFamily: theme.typography.fontFamilyMono,
    //   wordBreak: "break-word",
    //   whiteSpace: "pre-wrap",

    //   display: "flex",
    //   alignItems: "center",
    // }),
  })
);

export default function LongText({
  // column,
  value,
}: CustomCellProps) {
  // const { tableState } = useFiretableContext();
  const classes = useStyles();
  // const classes = useStyles({
  //   width: column.width,
  //   rowHeight: tableState?.config?.rowHeight ?? 44,
  // });

  if (!value) return null;

  const formattedJson = jsonFormat(value, {
    type: "space",
    char: " ",
    size: 2,
  });

  return (
    // <Tooltip
    //   title={formattedJson}
    //   enterDelay={1000}
    //   onClick={(e) => e.stopPropagation()}
    //   placement="bottom-start"
    //   PopperProps={{
    //     modifiers: {
    //       flip: { enabled: false },
    //       preventOverflow: {
    //         enabled: false,
    //         boundariesElement: "scrollParent",
    //       },
    //       hide: { enabled: false },
    //     },
    //   }}
    //   TransitionComponent={Fade}
    //   classes={{ tooltip: classes.tooltip }}
    // >
    <div className={classes.root}>{formattedJson}</div>
    // </Tooltip>
  );
}
