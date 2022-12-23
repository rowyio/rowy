import { useState, Suspense } from "react";
import { useSetAtom } from "jotai";
import { colord } from "colord";

import {
  alpha,
  Drawer,
  DrawerProps,
  Stack,
  IconButton,
  List,
  Box,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/MenuOpen";
import DocsIcon from "@mui/icons-material/LibraryBooksOutlined";
import LearningIcon from "@mui/icons-material/LocalLibraryOutlined";
import HelpIcon from "@mui/icons-material/HelpOutline";
import CommunityIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import {
  ChevronRight as ChevronRightIcon,
  Checklist as ChecklistIcon,
} from "@src/assets/icons";

import Logo from "@src/assets/Logo";
import NavItem from "./NavItem";
import GetStartedProgress from "@src/components/GetStartedChecklist/GetStartedProgress";
import LearningMenu from "./LearningMenu";
import CommunityMenu from "./CommunityMenu";
import HelpMenu from "./HelpMenu";
import { INavDrawerContentsProps } from "./NavDrawerContents";

import { projectScope, getStartedChecklistAtom } from "@src/atoms/projectScope";
import { EXTERNAL_LINKS, WIKI_LINKS } from "@src/constants/externalLinks";
import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import useGetStartedCompletion from "@src/components/GetStartedChecklist/useGetStartedCompletion";

export const NAV_DRAWER_WIDTH = 256;
export const NAV_DRAWER_COLLAPSED_WIDTH = 56;

export interface INavDrawerProps extends DrawerProps {
  open: boolean;
  isPermanent: boolean;
  onClose: NonNullable<DrawerProps["onClose"]>;
  Contents: React.ComponentType<INavDrawerContentsProps>;
}

export default function NavDrawer({
  open,
  isPermanent,
  onClose,
  Contents,
}: INavDrawerProps) {
  const [hover, _setHover] = useState<boolean | "persist">(false);
  const collapsed = !open && isPermanent;
  const setHover = collapsed ? _setHover : () => {};
  const tempExpanded = hover && collapsed;

  const width =
    collapsed && !tempExpanded ? NAV_DRAWER_COLLAPSED_WIDTH : NAV_DRAWER_WIDTH;
  const closeDrawer = isPermanent
    ? undefined
    : (e: {}) => onClose(e, "escapeKeyDown");

  const openGetStartedChecklist = useSetAtom(
    getStartedChecklistAtom,
    projectScope
  );
  const [getStartedCompleted, getStartedCompletionCount] =
    useGetStartedCompletion();

  const [learningMenuAnchorEl, setLearningMenuAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [communityMenuAnchorEl, setCommunityMenuAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [helpMenuAnchorEl, setHelpMenuAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const externalLinkIcon = (
    <ListItemSecondaryAction sx={{ right: 10 }}>
      <InlineOpenInNewIcon />
    </ListItemSecondaryAction>
  );

  return (
    <>
      <Drawer
        open={isPermanent || open}
        onClose={onClose}
        hideBackdrop={isPermanent}
        ModalProps={{ disablePortal: true }}
        variant={isPermanent ? "permanent" : "temporary"}
        anchor="left"
        sx={[
          {
            width,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width,
              pt: 0,
              scrollbarWidth: "thin",

              "--nav-bg": (theme) =>
                colord(theme.palette.background.paper)
                  .mix("#fff", 0.09) // elevation 8
                  .alpha(1)
                  .toHslString(),
              bgcolor: "var(--nav-bg)",
              backgroundImage: "none",
            },
          },
          isPermanent && {
            position: "fixed",
            zIndex: (theme) => theme.zIndex.appBar - 1,

            "& .MuiDrawer-paper": {
              mt: `${TOP_BAR_HEIGHT - 4}px`,
              height: `calc(100% - ${TOP_BAR_HEIGHT - 4}px)`,
              pt: 0.5,
              borderRadius: 2,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,

              width,
              transitionProperty:
                "width, transform, background-color, box-shadow",
              transitionTimingFunction: "var(--nav-transition-timing-function)",
              transitionDuration: "var(--nav-transition-duration)",
              overflowX: "hidden",

              borderRight: "none",
              "--nav-bg": (theme) => theme.palette.background.default,
            },

            "& .MuiListItemSecondaryAction-root": {
              transitionProperty: "opacity",
              transitionTimingFunction: "var(--nav-transition-timing-function)",
              transitionDuration: "var(--nav-transition-duration)",
            },
          },
          collapsed &&
            !tempExpanded && {
              "& .MuiDrawer-paper": {
                scrollbarWidth: "none",
                "::-webkit-scrollbar": { display: "none" },
              },
              "& .MuiListItemSecondaryAction-root": {
                opacity: 0,
                transitionDelay: "0ms",
              },
            },
          tempExpanded && {
            zIndex: "drawer",
            "& .MuiDrawer-paper": {
              "--nav-bg": (theme) =>
                colord(theme.palette.background.paper)
                  .mix("#fff", 0.09) // elevation 8
                  .alpha(1)
                  .toHslString(),
              boxShadow: (theme) =>
                theme.shadows[4].replace(/, 0 (\d+px)/g, ", $1 0"),
            },
          },
        ]}
        PaperProps={{
          elevation: isPermanent ? 0 : 8,
          onMouseEnter: () =>
            setHover((h) => (h === "persist" ? "persist" : true)),
          onMouseLeave: () =>
            setHover((h) => (h === "persist" ? "persist" : false)),
        }}
      >
        {!isPermanent && (
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              height: TOP_BAR_HEIGHT,
              flexShrink: 0,
              px: 0.5,
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "var(--nav-bg)",
            }}
          >
            <IconButton
              aria-label="Close navigation drawer"
              onClick={onClose as any}
              size="large"
            >
              <CloseIcon />
            </IconButton>

            <Logo style={{ marginLeft: 1, position: "relative", zIndex: 1 }} />
          </Stack>
        )}

        <nav style={{ flexGrow: 1 }}>
          <List
            component="ol"
            disablePadding
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "static",
              backgroundColor: "var(--nav-bg)",
            }}
          >
            <Suspense
              fallback={new Array(3).fill(undefined).map((_, i) => (
                <Skeleton
                  key={i}
                  height={32}
                  variant="rectangular"
                  sx={{ mx: 0.5, my: 0.25 }}
                />
              ))}
            >
              <Contents
                closeDrawer={closeDrawer}
                open={open}
                isPermanent={isPermanent}
                tempExpanded={tempExpanded}
                setHover={setHover}
              />
            </Suspense>

            <List
              component="li"
              disablePadding
              sx={{
                position: "sticky",
                bottom: 0,
                bgcolor: "var(--nav-bg)",
                mt: "auto",
                pb: 1,
              }}
            >
              <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
                <Divider variant="middle" sx={{ mb: 1 }} />

                {getStartedCompletionCount <
                  Object.keys(getStartedCompleted).length && (
                  <li>
                    <NavItem
                      onClick={() => {
                        openGetStartedChecklist(true);
                        setHover(false);
                      }}
                      sx={{
                        mb: 1,
                        py: 0.5,
                        bgcolor: (theme) =>
                          alpha(
                            theme.palette.primary.main,
                            theme.palette.action.selectedOpacity
                          ),
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(
                              theme.palette.primary.main,
                              theme.palette.action.selectedOpacity +
                                theme.palette.action.hoverOpacity
                            ),
                        },
                        "& *, &&:hover *": {
                          color: (theme) =>
                            theme.palette.primary[
                              theme.palette.mode === "dark" ? "light" : "dark"
                            ],
                        },
                      }}
                    >
                      <ListItemIcon>
                        <ChecklistIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Get started"
                        secondary={<GetStartedProgress sx={{ mr: 3 }} />}
                      />
                      <ListItemSecondaryAction>
                        <ChevronRightIcon />
                      </ListItemSecondaryAction>
                    </NavItem>
                  </li>
                )}

                <li>
                  <NavItem href={EXTERNAL_LINKS.docs}>
                    <ListItemIcon>
                      <DocsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Docs" />
                    {externalLinkIcon}
                  </NavItem>
                </li>

                <li>
                  <NavItem
                    onClick={(e: any) => {
                      setLearningMenuAnchorEl(e.currentTarget);
                      setHover("persist");
                    }}
                  >
                    <ListItemIcon>
                      <LearningIcon />
                    </ListItemIcon>
                    <ListItemText primary="Learning" />
                    <ListItemSecondaryAction>
                      <ChevronRightIcon />
                    </ListItemSecondaryAction>
                  </NavItem>
                  <LearningMenu
                    anchorEl={learningMenuAnchorEl}
                    onClose={() => {
                      setLearningMenuAnchorEl(null);
                      setHover(false);
                    }}
                  />
                </li>

                <li>
                  <NavItem
                    onClick={(e: any) => {
                      setCommunityMenuAnchorEl(e.currentTarget);
                      setHover("persist");
                    }}
                  >
                    <ListItemIcon>
                      <CommunityIcon />
                    </ListItemIcon>
                    <ListItemText primary="Join our community" />
                    <ListItemSecondaryAction>
                      <ChevronRightIcon />
                    </ListItemSecondaryAction>
                  </NavItem>
                  <CommunityMenu
                    anchorEl={communityMenuAnchorEl}
                    onClose={() => {
                      setCommunityMenuAnchorEl(null);
                      setHover(false);
                    }}
                  />
                </li>

                <li>
                  <NavItem
                    onClick={(e: any) => {
                      setHelpMenuAnchorEl(e.currentTarget);
                      setHover("persist");
                    }}
                  >
                    <ListItemIcon>
                      <HelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Help" />
                    <ListItemSecondaryAction>
                      <ChevronRightIcon />
                    </ListItemSecondaryAction>
                  </NavItem>
                  <HelpMenu
                    anchorEl={helpMenuAnchorEl}
                    onClose={() => {
                      setHelpMenuAnchorEl(null);
                      setHover(false);
                    }}
                  />
                </li>
              </ol>
            </List>
          </List>
        </nav>
      </Drawer>

      {isPermanent && (
        <Box
          sx={{
            flexShrink: 0,
            flexGrow: 0,
            width: open ? NAV_DRAWER_WIDTH : NAV_DRAWER_COLLAPSED_WIDTH,
            transitionProperty: "width",
            transitionTimingFunction: "var(--nav-transition-timing-function)",
            transitionDuration: "var(--nav-transition-duration)",
          }}
        />
      )}
    </>
  );
}
