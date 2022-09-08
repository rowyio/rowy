import { styled, Drawer, drawerClasses } from "@mui/material";
import { DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH } from "./index";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import { TABLE_TOOLBAR_HEIGHT } from "@src/components/TableToolbar";

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  ".sidedrawer-disabled": {
    [`& .${drawerClasses.paper}`]: {
      transform: `translateX(calc(100% - env(safe-area-inset-right) - ${DRAWER_COLLAPSED_WIDTH}px))`,
    },
    "& .MuiFab-root": {
      transform: "scale(0)",
    },
  },

  [`.${drawerClasses.root}`]: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },

  [`.${drawerClasses.paper}`]: {
    border: "none",
    boxShadow: theme.shadows[4].replace(/, 0 (\d+px)/g, ", -$1 0"),
    borderTopLeftRadius: `${(theme.shape.borderRadius as number) * 3}px`,
    borderBottomLeftRadius: `${(theme.shape.borderRadius as number) * 3}px`,

    width: DRAWER_WIDTH,
    maxWidth: `calc(100% - 28px - ${theme.spacing(1)})`,
    overflowX: "visible",
    overflowY: "visible",

    boxSizing: "content-box",

    top: TOP_BAR_HEIGHT + TABLE_TOOLBAR_HEIGHT,
    height: `calc(100% - ${TOP_BAR_HEIGHT + TABLE_TOOLBAR_HEIGHT}px)`,
    ".MuiDialog-paperFullScreen &": {
      top:
        TOP_BAR_HEIGHT +
        TABLE_TOOLBAR_HEIGHT +
        Number(theme.spacing(2).replace("px", "")),
      height: `calc(100% - ${
        TOP_BAR_HEIGHT + TABLE_TOOLBAR_HEIGHT
      }px - ${theme.spacing(2)})`,
    },

    transition: theme.transitions.create("transform", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),

    zIndex: theme.zIndex.drawer - 1,
  },
  [`:not(.sidedrawer-open) .${drawerClasses.paper}`]: {
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
  [`:not(.sidedrawer-disabled) .${drawerClasses.paper}`]: {
    animation: `${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut} bumpPaper`,
  },

  ".MuiFab-root": {
    display: "flex",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.short,
    }),

    boxShadow: theme.shadows[4],
    "&:active": { boxShadow: theme.shadows[4] },

    "&.Mui-disabled": { boxShadow: theme.shadows[4] },

    "& + &": { marginTop: theme.spacing(4) },
  },

  ".sidedrawer-nav-fab-container": {
    position: "absolute",
    top: theme.spacing(5),
    left: -32 / 2,
    zIndex: theme.zIndex.drawer + 1,

    animation: `${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut} both navFabSlide`,

    "& .MuiFab-root.Mui-disabled": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? undefined
          : theme.palette.background.paper,
    },
  },
  "@keyframes navFabSlide": {
    from: {
      opacity: 0,
      transform: "translateY(-48px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },

  ".sidedrawer-open-fab-container": {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: theme.spacing(-3.5),
    zIndex: theme.zIndex.drawer + 1,
  },

  ".sidedrawer-contents": {
    padding: theme.spacing(5),
    paddingRight: `max(env(safe-area-inset-right), ${theme.spacing(4)})`,
    paddingBottom: `max(env(safe-area-inset-bottom), ${theme.spacing(5)})`,
    overflowY: "auto",
  },
}));

export default StyledDrawer;
