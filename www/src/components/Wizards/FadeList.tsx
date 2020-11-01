import React from "react";
import clsx from "clsx";

import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    listWrapper: {
      position: "relative",

      "&::after": {
        content: '""',
        display: "block",
        pointerEvents: "none",

        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,

        height: theme.spacing(3),
        backgroundImage: `linear-gradient(to top, ${
          theme.palette.background.elevation?.[24] ??
          theme.palette.background.paper
        }, transparent)`,
      },
    },
    list: {
      listStyleType: "none",
      margin: 0,
      padding: theme.spacing(1.5, 0, 3),

      height: 400,
      overflowY: "overlay" as any,

      "& li": { margin: theme.spacing(0.5, 0) },
    },
  })
);

export interface IFadeListProps {
  children?: React.ReactNode | React.ElementType[];
  classes?: Partial<ReturnType<typeof useStyles>>;
}

export const FadeList = React.forwardRef<HTMLDivElement, IFadeListProps>(
  function FadeList_({ children, classes: classesProp }, ref) {
    const classes = useStyles();

    return (
      <div
        className={clsx(classes.listWrapper, classesProp?.listWrapper)}
        ref={ref}
      >
        <ul className={clsx(classes.list, classesProp?.list)}>{children}</ul>
      </div>
    );
  }
);

export default FadeList;
