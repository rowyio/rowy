import { makeStyles, createStyles } from "@material-ui/core";
import { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH } from "./index";

export const useStyles = makeStyles(theme =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },

    drawerOpen: {
      width: DRAWER_WIDTH,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),

      overflowX: "hidden" as "hidden",
      width: DRAWER_COLLAPSED_WIDTH,
    },

    paper: {
      border: "none",
      boxShadow:
        "0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 8px 10px 1px rgba(0, 0, 0, 0.14)",
      borderRadius: `${theme.shape.borderRadius * 2}px 0 0 ${theme.shape
        .borderRadius * 2}px`,
    },

    drawerFab: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: theme.spacing(1),

      zIndex: theme.zIndex.drawer + 1,

      boxShadow:
        "-2px 0 4px -1px rgba(0, 0, 0, 0.2), -1px 0 10px 0 rgba(0, 0, 0, 0.12), -4px 0 5px 0 rgba(0, 0, 0, 0.14)",

      transition: theme.transitions.create(["transform", "box-shadow"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerFabOpen: {
      transform: `translate(-${DRAWER_WIDTH - DRAWER_COLLAPSED_WIDTH}px, -50%)`,

      transitionDuration: `${theme.transitions.duration.leavingScreen}ms`,

      "& $drawerFabIcon": {
        transform: "rotate(180deg)",
        transitionDuration: `${theme.transitions.duration.leavingScreen}ms`,
      },
    },
    drawerFabIcon: {
      width: "2em",
      height: "2em",

      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },

    drawerContents: {
      padding: theme.spacing(8),
    },
  })
);
