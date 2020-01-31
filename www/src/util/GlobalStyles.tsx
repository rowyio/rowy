import React from "react";

import { makeStyles, createStyles } from "@material-ui/core";

export const useGlobalStyles = makeStyles(theme =>
  createStyles({
    "@global": {
      // Overrides <CSSBaseline />
      "*": {
        fontFeatureSettings: '"liga"',
      },

      // Fix width to width of card columns
      ".rendered-html": {
        "& p": { margin: 0 },
        "& * + p": { marginTop: "1em" },

        "& ul": {
          margin: 0,
          paddingLeft: "1.5em",
        },
        "& * + ul": { marginTop: "1em" },
        "& li + li": {
          marginTop: "0.5em",
        },
      },

      a: {
        fontWeight: "bold",
        color: theme.palette.primary.main,
      },
    },
  })
);

const GlobalStyles: React.FunctionComponent = () => {
  useGlobalStyles();
  return null;
};

export default GlobalStyles;
