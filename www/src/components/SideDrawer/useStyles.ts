import { makeStyles, createStyles } from "@material-ui/core";
import { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH } from "./index";

export const useStyles = makeStyles((theme) =>
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
      borderRadius: `${theme.shape.borderRadius * 2}px 0 0 ${
        theme.shape.borderRadius * 2
      }px`,
      backgroundColor:
        theme.palette.background.elevation?.[24] ??
        theme.palette.background.paper,

      width: DRAWER_WIDTH,
      overflowX: "visible",
      overflowY: "visible",

      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.custom,
        duration: theme.transitions.duration.standard,
      }),

      zIndex: theme.zIndex.drawer + 50,
    },
    paperClose: {
      transform: `translateX(${DRAWER_WIDTH - DRAWER_COLLAPSED_WIDTH}px)`,
    },

    "@keyframes bumpPaper": {
      "0%": {
        transform: `translateX(${DRAWER_WIDTH - DRAWER_COLLAPSED_WIDTH}px)`,
      },
      "50%": {
        transform: `translateX(${
          DRAWER_WIDTH - DRAWER_COLLAPSED_WIDTH - theme.spacing(4)
        }px)`,
      },
      "100%": {
        transform: `translateX(${DRAWER_WIDTH - DRAWER_COLLAPSED_WIDTH}px)`,
      },
    },
    bumpPaper: {
      animation: `${theme.transitions.duration.standard}ms ${theme.transitions.easing.custom} $bumpPaper`,
    },

    fab: {
      display: "flex",

      "&$disabled": {
        boxShadow: theme.shadows[6],
        backgroundColor:
          theme.palette.grey[theme.palette.type === "light" ? 300 : 800],
      },

      "& + &": { marginTop: theme.spacing(4) },
    },

    navFabContainer: {
      position: "absolute",
      top: theme.spacing(8),
      left: -theme.spacing(2.5),
      zIndex: theme.zIndex.drawer + 1,
    },
    "@keyframes navFab": {
      from: { transform: "translateY(-50vh)" },
      to: { transform: "translateY(0)" },
    },
    navFab: {
      animation: `${theme.transitions.duration.standard}ms ${theme.transitions.easing.custom} both $navFab`,
    },

    drawerFabContainer: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      left: -theme.spacing(3.5),
      zIndex: theme.zIndex.drawer + 1,
    },
    drawerFabIcon: {
      width: "2em",
      height: "2em",
      "$open &": { transform: "rotate(180deg)" },
    },

    drawerContents: {
      padding: theme.spacing(8),
      overflowY: "auto",
    },
  })
);
