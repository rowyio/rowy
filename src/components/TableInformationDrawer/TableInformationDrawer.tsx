import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { ErrorBoundary } from "react-error-boundary";
import clsx from "clsx";

import {
  Box,
  Drawer,
  drawerClasses,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { sideDrawerAtom, tableScope } from "@src/atoms/tableScope";

import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import { TABLE_TOOLBAR_HEIGHT } from "@src/components/TableToolbar";
import ErrorFallback from "@src/components/ErrorFallback";
import Details from "./Details";

export const DRAWER_WIDTH = 450;

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
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
    transform: `translateX(calc(100% - env(safe-area-inset-right)))`,
  },

  ".sidedrawer-contents": {
    height: "100%",
    overflow: "hidden",
    marginLeft: theme.spacing(5),
    marginRight: `max(env(safe-area-inset-right), ${theme.spacing(1)})`,
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(5),
  },
}));

export default function SideDrawer() {
  const [sideDrawer, setSideDrawer] = useAtom(sideDrawerAtom, tableScope);

  // const DetailsComponent =
  //   userRoles.includes("ADMIN") && tableSettings.templateSettings
  //     ? withTemplate(Details)
  //     : Details;
  // const DetailsComponent = Details;
  const open = sideDrawer === "table-information";

  return (
    <StyledDrawer
      className={clsx(open && "sidedrawer-open")}
      open={open}
      variant="permanent"
      anchor="right"
      PaperProps={{ elevation: 4, component: "aside" } as any}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {open && (
          <div className="sidedrawer-contents">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              pr={3}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                py={1}
              >
                <Typography variant="h5" component="h2">
                  Information
                </Typography>
              </Stack>
              <Tooltip title="Close">
                <IconButton
                  onClick={() => setSideDrawer(RESET)}
                  aria-label="Close"
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Stack>
            <Box
              sx={{
                height: "100%",
                overflow: "auto",
              }}
            >
              <Details />
            </Box>
          </div>
        )}
      </ErrorBoundary>
    </StyledDrawer>
  );
}
