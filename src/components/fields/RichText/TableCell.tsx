import clsx from "clsx";
import { IHeavyCellProps } from "../types";

import { makeStyles, createStyles } from "@mui/styles";
import { Tooltip, Fade } from "@mui/material";

import { useProjectContext } from "@src/contexts/ProjectContext";
import RenderedHtml from "@src/components/RenderedHtml";

type StylesProps = { width: number; rowHeight: number };

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: theme.spacing(3 / 8, 1.25),
      position: "absolute",
      top: 0,
      bottom: 0,

      display: "flex",
      alignItems: "center",
    },

    renderedHtml: {
      maxHeight: "100%",
      whiteSpace: "normal",

      ...theme.typography.body2,
      fontSize: "0.75rem",
      font: "inherit",
    },

    tooltip: ({ width, rowHeight }: StylesProps) => ({
      margin: 0,
      marginTop: `-${rowHeight - 1}px !important`,
      padding: theme.spacing(3 / 8, 1.25),

      width: width - 1,
      maxWidth: "none",
      minHeight: rowHeight - 1,
      overflowX: "hidden",

      background: theme.palette.background.paper,
      borderRadius: 0,
      boxShadow: `0 0 0 1px ${theme.palette.divider}, ${theme.shadows[4]}`,
      color: theme.palette.text.primary,

      display: "flex",
      alignItems: "center",
    }),
  })
);

export default function RichText({ column, value }: IHeavyCellProps) {
  const { tableState } = useProjectContext();
  const classes = useStyles({
    width: column.width as number,
    rowHeight: tableState?.config?.rowHeight ?? 44,
  });

  if (!value) return null;

  return (
    <Tooltip
      title={<RenderedHtml html={value} className={classes.renderedHtml} />}
      enterDelay={1000}
      placement="bottom-start"
      PopperProps={{
        modifiers: [
          { name: "flip", enabled: false },
          { name: "preventOverflow", enabled: false },
          { name: "hide", enabled: false },
        ],
      }}
      TransitionComponent={Fade}
      classes={{ tooltip: classes.tooltip }}
    >
      <div className={clsx("cell-collapse-padding", classes.root)}>
        <RenderedHtml html={value} className={classes.renderedHtml} />
      </div>
    </Tooltip>
  );
}
