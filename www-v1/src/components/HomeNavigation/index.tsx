import clsx from "clsx";

import { makeStyles, createStyles } from "@material-ui/styles";
import {
  useScrollTrigger,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import FiretableLogo from "assets/FiretableLogo";
import NavDrawer, { NAV_DRAWER_WIDTH } from "./NavDrawer";
import UserMenu from "components/Navigation/UserMenu";

export const APP_BAR_HEIGHT = 56;

const useStyles = makeStyles((theme) =>
  createStyles({
    open: {},

    navDrawerContainer: {
      [theme.breakpoints.up("md")]: {
        width: 0,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),

        "$open &": {
          width: NAV_DRAWER_WIDTH,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    },

    appBar: {
      height: APP_BAR_HEIGHT,

      [theme.breakpoints.down("md")]: { paddingRight: 0 },

      [theme.breakpoints.up("md")]: {
        transition:
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }) +
          ", " +
          theme.transitions.create(["box-shadow", "background-color"]),
        "$open &": {
          width: `calc(100% - ${NAV_DRAWER_WIDTH}px)`,
          transition:
            theme.transitions.create("width", {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }) +
            ", " +
            theme.transitions.create(["box-shadow", "background-color"]),
        },
      },

      // Elevation 8
      backgroundImage:
        "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
      "&::before": {
        content: "''",
        display: "block",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,

        backgroundColor: theme.palette.background.default,
        transition: theme.transitions.create("opacity"),
      },
    },
    appBarScrolled: {
      "&::before": {
        opacity: 0,
      },
    },
    toolbar: {
      height: APP_BAR_HEIGHT,
      minHeight: "auto",
      minWidth: 0,
      maxWidth: "none",
      padding: theme.spacing(0, 2),
    },

    openButton: {
      opacity: 1,
      transition: theme.transitions.create("opacity"),
      "$open &": { opacity: 0 },
    },
    logo: {
      flex: 1,
      textAlign: "center",

      opacity: 1,
      transition: theme.transitions.create("opacity"),
      "$open &": { opacity: 0 },
    },
  })
);

export interface IHomeNavigationProps {
  children: React.ReactNode;

  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  handleCreateTable: () => void;
}

export default function HomeNavigation({
  children,
  open,
  setOpen,
  handleCreateTable,
}: IHomeNavigationProps) {
  const classes = useStyles();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  return (
    <Grid
      container
      wrap="nowrap"
      alignItems="flex-start"
      className={clsx(open && classes.open)}
    >
      <Grid item className={classes.navDrawerContainer}>
        <NavDrawer
          open={open}
          onClose={() => setOpen(false)}
          handleCreateTable={handleCreateTable}
        />
      </Grid>

      <Grid item xs>
        <AppBar
          color="inherit"
          elevation={trigger ? 1 : 0}
          className={clsx(classes.appBar, trigger && classes.appBarScrolled)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              aria-label="Open navigation drawer"
              onClick={() => setOpen(true)}
              edge="start"
              size="large"
              className={classes.openButton}
            >
              <MenuIcon />
            </IconButton>

            <div className={classes.logo}>
              <FiretableLogo />
            </div>

            <UserMenu />
          </Toolbar>
        </AppBar>

        {children}
      </Grid>
    </Grid>
  );
}
