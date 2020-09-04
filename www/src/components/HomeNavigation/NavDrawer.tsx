import React from "react";

import {
  makeStyles,
  createStyles,
  Drawer,
  DrawerProps,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import { APP_BAR_HEIGHT } from ".";
import FiretableLogo from "assets/Firetable";

import { useFiretableContext } from "contexts/firetableContext";
import useRouter from "hooks/useRouter";

export const NAV_DRAWER_WIDTH = 300;

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: { width: NAV_DRAWER_WIDTH },

    logoRow: {
      height: APP_BAR_HEIGHT,
      marginTop: 0,
      marginBottom: theme.spacing(1),

      padding: theme.spacing(0, 0.5, 0, 2),
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
  })
);

export interface INavDrawerProps extends DrawerProps {}

export default function NavDrawer(props: INavDrawerProps) {
  const classes = useStyles();

  const { sections } = useFiretableContext();
  const { location } = useRouter();
  const { hash } = location;

  return (
    <Drawer
      open
      variant="persistent"
      {...props}
      classes={{ paper: classes.paper }}
    >
      <Grid
        container
        spacing={1}
        wrap="nowrap"
        justify="space-between"
        alignItems="center"
        className={classes.logoRow}
      >
        <Grid item>
          <FiretableLogo />
        </Grid>

        <Grid item>
          <IconButton
            aria-label="Close navigation drawer"
            onClick={props.onClose as any}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>

      <nav>
        <List>
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
                >
                  <ListItemText
                    primary={section}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItem>
              </li>
            ))}
        </List>
      </nav>
    </Drawer>
  );
}
