import React from "react";

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
  TextField,
  MenuItem,
} from "@material-ui/core";

import FiretableLogo from "../assets/firetable.svg";

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
        <Grid item>
          <img
            src={FiretableLogo}
            width="32"
            height="32"
            alt="Firetable"
            className={classes.logo}
          />
        </Grid>

        <Grid item xs>
          <Typography
            variant={isMd ? "h6" : "h4"}
            color="primary"
            component="h1"
            className={classes.heading}
          >
            firetable
          </Typography>
        </Grid>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
