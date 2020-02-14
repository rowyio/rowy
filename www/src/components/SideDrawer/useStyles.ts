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

    drawerFabContainer: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%) rotate(90deg)",
      right: theme.spacing(1),
      zIndex: theme.zIndex.drawer + 1,

      width: theme.spacing(7),
      height: theme.spacing(7),
      borderRadius: "50%",
      backgroundColor: theme.palette.background.paper,

      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerFabOpen: {
      transform: `translate(-${DRAWER_WIDTH -
        DRAWER_COLLAPSED_WIDTH}px, -50%) rotate(90deg)`,

      transitionDuration: `${theme.transitions.duration.leavingScreen}ms`,

      "& $drawerFabIcon": {
        transform: "rotate(180deg)",
        transitionDuration: `${theme.transitions.duration.leavingScreen}ms`,
      },
    },
    drawerFab: {
      overflow: "hidden",
      "&$drawerFabDisabled": { boxShadow: theme.shadows[6] },
    },
    drawerFabIcon: {
      width: "2em",
      height: "2em",

      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerFabDisabled: {},

    drawerContents: {
      padding: theme.spacing(8),
    },
  })
);
