import { Link } from "react-router-dom";

import {
  createStyles,
  makeStyles,
  useTheme,
  useScrollTrigger,
  AppBar as MuiAppBar,
  Toolbar,
  Grid,
  Button,
} from "@material-ui/core";

import FiretableLogo from "assets/FiretableLogo";
import routes from "constants/routes";

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(6),
    },

    logo: {
      display: "block",
      marginRight: theme.spacing(1),
    },
    heading: {
      textTransform: "none",
      color: theme.palette.primary.main,
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

  return (
    <MuiAppBar
      position="sticky"
      color="default"
      className={classes.appBar}
      elevation={trigger ? 4 : 0}
    >
      <Toolbar>
        <Grid item xs>
          <FiretableLogo />
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
