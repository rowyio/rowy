import { IHeavyCellProps } from "../types";

import { makeStyles, createStyles, Tooltip, Fade } from "@material-ui/core";

import { useFiretableContext } from "contexts/FiretableContext";
import RenderedHtml from "components/RenderedHtml";

type StylesProps = { width: number; rowHeight: number };

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0.5, 0),
      position: "absolute",
      top: 0,
      bottom: 0,
      right: theme.spacing(1.5),
      left: theme.spacing(1.5),

      display: "flex",
      alignItems: "center",
    },

    renderedHtml: {
      maxHeight: "100%",
      whiteSpace: "normal",

      ...theme.typography.body2,
      fontSize: "0.75rem",
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
      color: theme.palette.text.primary,

      display: "flex",
      alignItems: "center",
    }),
  })
);

export default function RichText({ column, value }: IHeavyCellProps) {
  const { tableState } = useFiretableContext();
  const classes = useStyles({
    width: column.width,
    rowHeight: tableState?.config?.rowHeight ?? 44,
  });

  return (
    <Tooltip
      title={<RenderedHtml html={value} className={classes.renderedHtml} />}
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
        <RenderedHtml html={value} className={classes.renderedHtml} />
      </div>
    </Tooltip>
  );
}
