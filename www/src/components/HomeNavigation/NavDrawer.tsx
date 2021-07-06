import {
  makeStyles,
  createStyles,
  useTheme,
  useMediaQuery,
  Drawer,
  DrawerProps,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import CloseIcon from "assets/icons/Backburger";
import AddIcon from "@material-ui/icons/Add";

import { APP_BAR_HEIGHT } from ".";
import FiretableLogo from "assets/FiretableLogo";

import { useFiretableContext } from "contexts/FiretableContext";
import useRouter from "hooks/useRouter";

export const NAV_DRAWER_WIDTH = 300;

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: NAV_DRAWER_WIDTH,
      overflowX: "hidden",
      backgroundColor:
        theme.palette.background.elevation?.[1] ??
        theme.palette.background.paper,
    },

    logoRow: {
      height: APP_BAR_HEIGHT,
      marginTop: 0,
      marginBottom: theme.spacing(1),

      padding: theme.spacing(0, 2, 0, 0.5),
    },
    logo: { marginLeft: theme.spacing(1.5) },

    nav: { height: "100%" },
    list: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",

      height: "100%",
    },

    listItem: {
      color: theme.palette.text.secondary,
      minHeight: 48,
      transition: theme.transitions.create(["background-color", "color"]),
      "& $listItemIcon": { transition: theme.transitions.create("color") },
    },
    listItemSelected: {
      "&&, &&:hover": {
        color: theme.palette.primary.main,
        backgroundColor: fade(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    listItemIcon: {},
    listItemText: {
      ...theme.typography.button,
      display: "block",
      color: "inherit",
    },

    createTable: { marginTop: "auto" },
  })
);

export interface INavDrawerProps extends DrawerProps {
  handleCreateTable: () => void;
}

export default function NavDrawer({
  handleCreateTable,
  ...props
}: INavDrawerProps) {
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { sections } = useFiretableContext();
  const { location } = useRouter();
  const { hash } = location;

  return (
    <Drawer
      open
      variant={isSm ? "temporary" : "persistent"}
      {...props}
      classes={{ paper: classes.paper }}
    >
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
          >
            <CloseIcon />
          </IconButton>
        </Grid>

        <Grid item className={classes.logo}>
          <FiretableLogo />
        </Grid>
      </Grid>

      <nav className={classes.nav}>
        <List className={classes.list}>
          {sections &&
            Object.keys(sections).map((section) => (
              <li key={section}>
                <ListItem
                  button
                  component="a"
                  href={`#${section}`}
                  selected={
                    section === decodeURIComponent(hash.replace("#", ""))
                  }
                  classes={{
                    root: classes.listItem,
                    selected: classes.listItemSelected,
                  }}
                  onClick={isSm ? (props.onClose as any) : undefined}
                >
                  <ListItemText
                    primary={section}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItem>
              </li>
            ))}

          <li className={classes.createTable}>
            <ListItem
              button
              onClick={handleCreateTable}
              classes={{ root: classes.listItem }}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary="Create Table"
                classes={{ primary: classes.listItemText }}
              />
            </ListItem>
          </li>
        </List>
      </nav>
    </Drawer>
  );
}
