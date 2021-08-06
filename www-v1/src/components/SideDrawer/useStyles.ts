import { makeStyles, createStyles } from "@material-ui/styles";
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
      boxShadow: theme.shadows[16].replace(/, 0 (\d+px)/g, ", -$1 0"),
      borderTopLeftRadius: `${(theme.shape.borderRadius as number) * 3}px`,
      borderBottomLeftRadius: `${(theme.shape.borderRadius as number) * 3}px`,

      width: DRAWER_WIDTH,
      overflowX: "visible",
      overflowY: "visible",

      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.custom,
        duration: theme.transitions.duration.standard,
      }),

      zIndex: theme.zIndex.drawer - 1,
    },
    paperClose: {
      transform: `translateX(${DRAWER_WIDTH - DRAWER_COLLAPSED_WIDTH}px)`,
    },

    "@keyframes bumpPaper": {
      "0%": {
        transform: `translateX(${DRAWER_WIDTH - DRAWER_COLLAPSED_WIDTH}px)`,
      },
      "50%": {
        transform: `translateX(calc(${
          DRAWER_WIDTH - DRAWER_COLLAPSED_WIDTH
        }px - ${theme.spacing(4)}))`,
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

      boxShadow: theme.shadows[16],
      "&:active": { boxShadow: theme.shadows[16] },

      "&.Mui-disabled": {
        boxShadow: theme.shadows[16],
        backgroundColor: theme.palette.background.default,
        // backgroundColor:
        //   theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
      },

      "& + &": { marginTop: theme.spacing(4) },
    },

    navFabContainer: {
      position: "absolute",
      top: theme.spacing(8),
      left: theme.spacing(-2.5),
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
      left: theme.spacing(-3.5),
      zIndex: theme.zIndex.drawer + 1,
    },
    drawerFabIcon: {
      // width: "2em",
      // height: "2em",
      "$open &": { transform: "rotate(180deg)" },
    },

    drawerContents: {
      padding: theme.spacing(8),
      overflowY: "auto",
    },
  })
);
