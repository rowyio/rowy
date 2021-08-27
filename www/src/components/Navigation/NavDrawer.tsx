import { Link } from "react-router-dom";

import { makeStyles, createStyles } from "@material-ui/styles";
import {
  Drawer,
  DrawerProps,
  Grid,
  IconButton,
  List,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import CloseIcon from "assets/icons/Backburger";

import { APP_BAR_HEIGHT } from ".";
import FiretableLogo from "assets/FiretableLogo";
import NavDrawerItem from "./NavDrawerItem";

import { useFiretableContext } from "contexts/FiretableContext";
import { routes } from "constants/routes";

export const NAV_DRAWER_WIDTH = 300;

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: NAV_DRAWER_WIDTH,
      overflowX: "hidden",
    },

    logoRow: {
      height: APP_BAR_HEIGHT,
      marginTop: 0,
      marginBottom: theme.spacing(1),

      padding: theme.spacing(0, 2),
    },
    logo: { marginLeft: theme.spacing(1.5) },

    divider: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

export interface INavDrawerProps extends DrawerProps {
  currentSection?: string;
  currentTable: string;
}

export default function NavDrawer({
  currentSection,
  currentTable,
  ...props
}: INavDrawerProps) {
  const classes = useStyles();

  const { sections } = useFiretableContext();

  return (
    <Drawer open {...props} classes={{ paper: classes.paper }}>
      <Grid
        container
        spacing={1}
        wrap="nowrap"
        alignItems="center"
        className={classes.logoRow}
      >
        <Grid item>
          <IconButton
            aria-label="Close navigation drawer"
            onClick={props.onClose as any}
            edge="start"
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Grid>

        <Grid item className={classes.logo}>
          <FiretableLogo />
        </Grid>
      </Grid>

      <nav>
        <List>
          <li>
            <MenuItem component={Link} to={routes.home}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </MenuItem>
          </li>

          <Divider variant="middle" className={classes.divider} />

          {sections &&
            Object.entries(sections).map(([section, tables]) => (
              <NavDrawerItem
                key={section}
                section={section}
                tables={tables}
                currentSection={currentSection}
                currentTable={currentTable}
              />
            ))}
        </List>
      </nav>
    </Drawer>
  );
}
