import { makeStyles, createStyles, fade } from "@material-ui/core";
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
    },

    loadingContainer: {
      position: "sticky",
      left: 0,
      height: 100,
    },

    "@global": {
      ".rdg.rdg": {
        "--color": theme.palette.text.secondary,
        "--border-color": "#e0e0e0",
        // "--summary-border-color": "#aaa",
        "--background-color": theme.palette.background.paper,
        "--header-background-color": theme.palette.background.default,
        "--row-hover-background-color": "#f5f5f5",
        "--row-selected-background-color": "#dbecfa",
        "--row-selected-hover-background-color": "#c9e3f8",
        "--checkbox-color": "#005295",
        "--checkbox-focus-color": "#62b8ff",
        "--checkbox-disabled-border-color": "#ccc",
        "--checkbox-disabled-background-color": "#ddd",
        "--selection-color": "#66afe9",
        "--font-size": "0.75rem",

        border: "none",
        backgroundColor: "transparent",

        ...theme.typography.body2,
        fontSize: "0.75rem",
        lineHeight: "inherit !important",

        "& .rdg-cell": {
          display: "flex",
          alignItems: "center",
          padding: theme.spacing(0, 1.5),
        },
      },

      ".rdg-header-row .rdg-cell": {
        borderTop: "1px solid var(--border-color)",
      },

      // TODO:
      ".rdg-draggable-header-cell": {
        cursor: "move",
        display: "inline",

        "&.rdg-can-drop .rdg-cell": { backgroundColor: theme.palette.divider },
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
