import { makeStyles, createStyles } from "@mui/styles";
import { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH } from "./index";
import { APP_BAR_HEIGHT } from "@src/components/Navigation";
import { TABLE_HEADER_HEIGHT } from "@src/components/TableHeader";

export const useStyles = makeStyles((theme) =>
  createStyles({
    open: {},
    disabled: {
      "& $paper": {
        transform: `translateX(calc(100% - env(safe-area-inset-right) - ${DRAWER_COLLAPSED_WIDTH}px))`,
      },
      "& $fab": {
        transform: "scale(0)",
      },
    },

    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },

    paper: {
      border: "none",
      boxShadow: theme.shadows[4].replace(/, 0 (\d+px)/g, ", -$1 0"),
      borderTopLeftRadius: `${(theme.shape.borderRadius as number) * 3}px`,
      borderBottomLeftRadius: `${(theme.shape.borderRadius as number) * 3}px`,

      width: DRAWER_WIDTH,
      maxWidth: `calc(100% - 28px - ${theme.spacing(1)})`,
      overflowX: "visible",
      overflowY: "visible",

      boxSizing: "content-box",

      top: APP_BAR_HEIGHT + TABLE_HEADER_HEIGHT,
      height: `calc(100% - ${APP_BAR_HEIGHT + TABLE_HEADER_HEIGHT}px)`,

      transition: theme.transitions.create("transform", {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
      }),

      zIndex: theme.zIndex.drawer - 1,
    },
    paperClose: {
      transform: `translateX(calc(100% - env(safe-area-inset-right) - ${DRAWER_COLLAPSED_WIDTH}px))`,
    },

    "@keyframes bumpPaper": {
      "0%": {
        transform: `translateX(calc(100% - env(safe-area-inset-right) - ${DRAWER_COLLAPSED_WIDTH}px))`,
      },
      "50%": {
        transform: `translateX(calc(100% - env(safe-area-inset-right) - ${DRAWER_COLLAPSED_WIDTH}px - ${theme.spacing(
          4
        )}))`,
      },
      "100%": {
        transform: `translateX(calc(100% - env(safe-area-inset-right) - ${DRAWER_COLLAPSED_WIDTH}px))`,
      },
    },
    bumpPaper: {
      animation: `${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut} $bumpPaper`,
    },

    fab: {
      display: "flex",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.short,
      }),

      boxShadow: theme.shadows[4],
      "&:active": { boxShadow: theme.shadows[4] },

      "&.Mui-disabled": { boxShadow: theme.shadows[4] },

      "& + &": { marginTop: theme.spacing(4) },
    },

    navFabContainer: {
      position: "absolute",
      top: theme.spacing(6),
      left: -32 / 2,
      zIndex: theme.zIndex.drawer + 1,
    },
    "@keyframes navFab": {
      from: {
        opacity: 0,
        transform: "translateY(-48px)",
      },
      to: {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
    navFab: {
      animation: `${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut} both $navFab`,
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
      padding: theme.spacing(5),
      paddingRight: `max(env(safe-area-inset-right), ${theme.spacing(4)})`,
      paddingBottom: `max(env(safe-area-inset-bottom), ${theme.spacing(5)})`,
      overflowY: "auto",
    },
  })
);
