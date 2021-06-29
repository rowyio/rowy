import {
  makeStyles,
  createStyles,
  fade,
  emphasize,
  darken,
  lighten,
} from "@material-ui/core";
import { APP_BAR_HEIGHT } from "components/Navigation";
import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";

export const useStyles = makeStyles((theme) =>
  createStyles({
    tableWrapper: {
      display: "flex",
      flexDirection: "column",
      width: `calc(100% - ${DRAWER_COLLAPSED_WIDTH}px)`,
      height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,

      "& > .rdg": { flex: 1 },

      [theme.breakpoints.down("sm")]: { width: "100%" },
    },

    loadingContainer: {
      position: "sticky",
      left: 0,
      height: 100,
    },

    "@global": {
      ".rdg.rdg": {
        "--color": theme.palette.text.secondary,
        "--border-color": theme.palette.divider,
        // "--summary-border-color": "#aaa",
        "--background-color": theme.palette.background.paper,
        "--header-background-color": theme.palette.background.default,
        "--row-hover-background-color": emphasize(
          theme.palette.background.paper,
          0.04
        ),
        "--row-selected-background-color":
          theme.palette.type === "light"
            ? lighten(theme.palette.primary.main, 0.9)
            : darken(theme.palette.primary.main, 0.8),
        "--row-selected-hover-background-color":
          theme.palette.type === "light"
            ? lighten(theme.palette.primary.main, 0.8)
            : darken(theme.palette.primary.main, 0.7),
        "--checkbox-color": theme.palette.primary.main,
        "--checkbox-focus-color": theme.palette.primary.main,
        "--checkbox-disabled-border-color": "#ccc",
        "--checkbox-disabled-background-color": "#ddd",
        "--selection-color": theme.palette.primary.main,
        "--font-size": "0.75rem",
        "--cell-padding": theme.spacing(0, 1.5),

        border: "none",
        backgroundColor: "transparent",

        ...theme.typography.body2,
        fontSize: "0.75rem",
        lineHeight: "inherit !important",

        "& .rdg-cell": {
          display: "flex",
          alignItems: "center",
          padding: "var(--cell-padding)",

          overflow: "visible",
          contain: "none",
        },

        "& .rdg-cell-frozen-last": {
          boxShadow:
            theme.palette.type === "light"
              ? "2px 0 4px 0px rgba(0, 0, 0, .08)"
              : "2px 0 4px 0px rgba(0, 0, 0, .67)",
        },

        "& .rdg-cell-copied": {
          backgroundColor:
            theme.palette.type === "light"
              ? lighten(theme.palette.primary.main, 0.7)
              : darken(theme.palette.primary.main, 0.6),
        },
      },

      ".rdg-header-row .rdg-cell": {
        borderTop: "1px solid var(--border-color)",
      },

      ".rdg-row:hover": { color: theme.palette.text.primary },

      ".row-hover-iconButton": {
        color: theme.palette.text.disabled,
        transitionDuration: "0s",

        ".rdg-row:hover &": {
          color: theme.palette.text.primary,
          backgroundColor: fade(
            theme.palette.text.primary,
            theme.palette.action.hoverOpacity * 2
          ),
        },
      },

      ".cell-collapse-padding": {
        margin: theme.spacing(0, -1.5),
        width: `calc(100% + ${theme.spacing(3)}px)`,
      },
    },
  })
);

export default useStyles;
