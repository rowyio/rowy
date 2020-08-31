import React from "react";

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
        backgroundImage: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`,
      },
    },
    list: {
      listStyleType: "none",
      margin: 0,
      padding: theme.spacing(1.5, 0, 2.5),

      height: 200,
      overflowY: "auto",

      "& li": { margin: theme.spacing(0.5, 0) },
    },
  })
);

export interface IFadeListProps {
  children?: React.ReactNode | React.ElementType[];
}

export const FadeList = React.forwardRef<HTMLDivElement, IFadeListProps>(
  function FadeList_({ children }, ref) {
    const classes = useStyles();

    return (
      <div className={classes.listWrapper} ref={ref}>
        <ul className={classes.list}>{children}</ul>
      </div>
    );
  }
);

export default FadeList;
