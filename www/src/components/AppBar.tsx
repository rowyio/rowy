import React from "react";
import { Link } from "react-router-dom";

import {
  createStyles,
  makeStyles,
  useTheme,
  useMediaQuery,
  useScrollTrigger,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";

import FiretableLogo from "assets/firetable-with-wordmark.svg";

import routes from "constants/routes";

const useStyles = makeStyles(theme =>
  createStyles({
    appBar: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(8),
    },
    toolbar: {
      [theme.breakpoints.up("md")]: { minHeight: 80 },
    },

    logo: {
      display: "block",
      marginRight: theme.spacing(1),
    },
    heading: {
      textTransform: "none",
      color: "#ed4746",
      cursor: "default",
      userSelect: "none",
      fontFeatureSettings: '"liga"',
    },

    locationDropdown: {
      minWidth: 140,
      margin: 0,
    },
  })
);

interface IAppBarProps {}

const AppBar: React.FunctionComponent<IAppBarProps> = () => {
  const classes = useStyles();
  const theme = useTheme();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <MuiAppBar
      position="sticky"
      color="default"
      className={classes.appBar}
      elevation={trigger ? 4 : 0}
    >
      <Toolbar className={classes.toolbar}>
        <Grid item xs>
          <img
            src={FiretableLogo}
            width="140"
            height="32"
            alt="Firetable"
            className={classes.logo}
          />
        </Grid>

        <Grid item>
          <Button
            component={Link}
            to={routes.signOut}
            color="primary"
            variant="outlined"
          >
            Sign Out
          </Button>
        </Grid>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
