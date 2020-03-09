import { makeStyles, createStyles } from "@material-ui/core";
import { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH } from "./index";

export const useStyles = makeStyles(theme =>
  createStyles({
    open: {},
    disabled: {},

    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },

    paper: {
      border: "none",
      boxShadow:
        "0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 8px 10px 1px rgba(0, 0, 0, 0.14)",
      borderRadius: `${theme.shape.borderRadius * 2}px 0 0 ${theme.shape
        .borderRadius * 2}px`,

      width: DRAWER_WIDTH,
    },
    paperOpen: {
      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.custom,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    paperClose: {
      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.custom,
        duration: theme.transitions.duration.leavingScreen,
      }),

      overflowX: "hidden" as "hidden",
      transform: `translateX(${DRAWER_WIDTH - DRAWER_COLLAPSED_WIDTH}px)`,
    },

    fab: {
      display: "flex",

      "&$disabled": {
        boxShadow: theme.shadows[6],
        backgroundColor: theme.palette.grey[300],
      },

      "& + &": { marginTop: theme.spacing(4) },
    },

    navFabContainer: {
      position: "absolute",
      top: theme.spacing(8),
      right: DRAWER_WIDTH - 20,
      zIndex: theme.zIndex.drawer + 1,
    },
    "@keyframes navFab": {
      from: { transform: "translateY(-50vh)" },
      to: { transform: "translateY(0)" },
    },
    navFab: {
      animation: `${theme.transitions.duration.standard}ms $navFab both`,
    },

    drawerFabContainer: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: theme.spacing(1),
      zIndex: theme.zIndex.drawer + 1,

      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.custom,
        duration: theme.transitions.duration.enteringScreen,
      }),

      "$open &": {
        transform: `translate(-${DRAWER_WIDTH -
          DRAWER_COLLAPSED_WIDTH}px, -50%)`,

        transitionDuration: `${theme.transitions.duration.leavingScreen}ms`,
      },
    },
    drawerFabIcon: {
      width: "2em",
      height: "2em",

      "$open &": { transform: "rotate(180deg)" },
    },

    drawerContents: { padding: theme.spacing(8) },
  })
);
