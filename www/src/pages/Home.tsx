import { useState, useEffect } from "react";
import _groupBy from "lodash/groupBy";
import _find from "lodash/find";
import {
  createStyles,
  makeStyles,
  Container,
  Grid,
  Typography,
  Divider,
  Fab,
  Checkbox,
  Tooltip,
  IconButton,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";
import EditIcon from "@material-ui/icons/Edit";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import HomeNavigation from "components/HomeNavigation";
import StyledCard from "components/StyledCard";

import routes from "constants/routes";
import { useFiretableContext } from "contexts/FiretableContext";
import { useAppContext } from "contexts/AppContext";
import useDoc, { DocActions } from "hooks/useDoc";
import TableSettingsDialog, {
  TableSettingsDialogModes,
} from "components/TableSettings";

import ProjectSettings from "components/ProjectSettings";
import EmptyState from "components/EmptyState";
import WIKI_LINKS from "constants/wikiLinks";
const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      html: { scrollBehavior: "smooth" },
    },

    root: {
      minHeight: "100vh",
      paddingBottom: theme.spacing(8),
    },

    section: {
      paddingTop: theme.spacing(10),
      "&:first-of-type": { marginTop: theme.spacing(2) },
    },
    sectionHeader: {
      color: theme.palette.text.secondary,
    },
    divider: { margin: theme.spacing(1, 0, 3) },

    cardGrid: {
      [theme.breakpoints.down("xs")]: { maxWidth: 360, margin: "0 auto" },
    },
    card: {
      height: "100%",
      [theme.breakpoints.up("md")]: { minHeight: 220 },
      [theme.breakpoints.down("md")]: { minHeight: 180 },
    },
    favButton: {
      margin: theme.spacing(-0.5, -1, 0, 0),
    },
    editButton: {
      margin: theme.spacing(-1),
      marginRight: theme.spacing(-0.5),
    },
    configFab: {
      right: theme.spacing(15),
      position: "fixed",
      bottom: theme.spacing(3),
      width: 80,
      height: 80,
      borderRadius: theme.shape.borderRadius * 2,
      "& svg": { width: "2em", height: "2em" },
    },
    fab: {
      position: "fixed",
      bottom: theme.spacing(3),
      right: theme.spacing(3),

      width: 80,
      height: 80,

      borderRadius: theme.shape.borderRadius * 2,
      "& svg": { width: "2em", height: "2em" },
    },
  })
);

export default function HomePage() {
  const classes = useStyles();

  const [settingsDialogState, setSettingsDialogState] = useState<{
    mode: null | TableSettingsDialogModes;
    data: null | {
      collection: string;
      description: string;
      roles: string[];
      name: string;
      section: string;
      isCollectionGroup: boolean;
      tableType: string;
    };
  }>({
    mode: null,
    data: null,
  });

  const clearDialog = () =>
    setSettingsDialogState({
      mode: null,
      data: null,
    });

  const { sections } = useFiretableContext();
  const { userDoc } = useAppContext();

  const favs = userDoc.state.doc?.favoriteTables
    ? userDoc.state.doc.favoriteTables
    : [];

  const handleCreateTable = () =>
    setSettingsDialogState({
      mode: TableSettingsDialogModes.create,
      data: null,
    });
  const [open, setOpen] = useState(false);
  const [openProjectSettings, setOpenProjectSettings] = useState(false);

  const [settingsDocState, settingsDocDispatch] = useDoc({
    path: "_FIRETABLE_/settings",
  });
  useEffect(() => {
    if (!settingsDocState.loading && !settingsDocState.doc) {
      settingsDocDispatch({
        action: DocActions.update,
        data: { createdAt: new Date() },
      });
    }
  }, [settingsDocState]);
  if (settingsDocState.error?.code === "permission-denied") {
    return (
      <EmptyState
        fullScreen
        message="Access Denied"
        description={
          <>
            <Typography variant="overline">
              You don't current have access to firetable, please contact this
              project's owner
            </Typography>
            <Typography variant="body2">
              If you are the project owner please follow the instructions{" "}
              <a href={WIKI_LINKS.securityRules} target="_blank" rel="noopener">
                here
              </a>{" "}
              to setup the project rules.
            </Typography>
          </>
        }
      />
    );
  }

  const TableCard = ({ table }) => {
    const checked = Boolean(_find(favs, table));
    return (
      <Grid key={table.name} item xs={12} sm={6} md={open ? 6 : 4}>
        <StyledCard
          className={classes.card}
          overline={table.section}
          title={table.name}
          headerAction={
            <Checkbox
              onClick={() => {
                userDoc.dispatch({
                  action: DocActions.update,
                  data: {
                    favoriteTables: checked
                      ? favs.filter((t) => t.collection !== table.collection)
                      : [...favs, table],
                  },
                });
              }}
              checked={checked}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              name="checkedH"
              className={classes.favButton}
            />
          }
          bodyContent={table.description}
          primaryLink={{
            to: `${
              table.isCollectionGroup ? routes.tableGroup : routes.table
            }/${table.collection.replace(/\//g, "~2F")}`,
            label: "Open",
          }}
          secondaryAction={
            <IconButton
              onClick={() =>
                setSettingsDialogState({
                  mode: TableSettingsDialogModes.update,
                  data: table,
                })
              }
              aria-label="Edit table"
              className={classes.editButton}
            >
              <EditIcon />
            </IconButton>
          }
        />
      </Grid>
    );
  };

  return (
    <HomeNavigation
      open={open}
      setOpen={setOpen}
      handleCreateTable={handleCreateTable}
    >
      <main className={classes.root}>
        <Container>
          {favs.length !== 0 && (
            <section id="favorites" className={classes.section}>
              <Typography
                variant="h6"
                component="h1"
                className={classes.sectionHeader}
              >
                Favorites
              </Typography>
              <Divider className={classes.divider} />
              <Grid
                container
                spacing={4}
                justify="flex-start"
                className={classes.cardGrid}
              >
                {favs.map((table) => (
                  <TableCard key={table.collection} table={table} />
                ))}
              </Grid>
            </section>
          )}

          {sections &&
            Object.keys(sections).map((sectionName) => (
              <section
                key={sectionName}
                id={sectionName}
                className={classes.section}
              >
                <Typography
                  variant="h6"
                  component="h1"
                  className={classes.sectionHeader}
                >
                  {sectionName === "undefined" ? "Other" : sectionName}
                </Typography>

                <Divider className={classes.divider} />

                <Grid
                  container
                  spacing={4}
                  justify="flex-start"
                  className={classes.cardGrid}
                >
                  {sections[sectionName].map((table, i) => (
                    <TableCard key={`${i}-${table.collection}`} table={table} />
                  ))}
                </Grid>
              </section>
            ))}

          <section className={classes.section}>
            <Tooltip title="Create a table">
              <Fab
                className={classes.fab}
                color="secondary"
                aria-label="Create table"
                onClick={handleCreateTable}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="Configure Firetable">
              <Fab
                className={classes.configFab}
                color="secondary"
                aria-label="Create table"
                onClick={() => setOpenProjectSettings(true)}
              >
                <SettingsIcon />
              </Fab>
            </Tooltip>
          </section>
        </Container>
      </main>

      <TableSettingsDialog
        clearDialog={clearDialog}
        mode={settingsDialogState.mode}
        data={settingsDialogState.data}
      />
      {openProjectSettings && (
        <ProjectSettings handleClose={() => setOpenProjectSettings(false)} />
      )}
    </HomeNavigation>
  );
}
