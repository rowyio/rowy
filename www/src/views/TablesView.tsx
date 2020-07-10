import React, { useState } from "react";
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
import EditIcon from "@material-ui/icons/Edit";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import AppBar from "components/AppBar";
import StyledCard from "components/StyledCard";

import routes from "constants/routes";
import { useFiretableContext } from "contexts/firetableContext";
import { useAppContext } from "contexts/appContext";
import { DocActions } from "hooks/useDoc";
import TableSettingsDialog, {
  TableSettingsDialogModes,
} from "components/TableSettingsDialog";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      minHeight: "100vh",
      paddingBottom: theme.spacing(8),
    },

    section: {
      "& + &": { marginTop: theme.spacing(8) },
    },
    sectionHeader: {
      color: theme.palette.text.secondary,
      textTransform: "uppercase",
      letterSpacing: `${2 / 13}em`,
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

const regionalFilter = (regional, userClaims) =>
  regional && userClaims?.regions && !userClaims?.regions?.includes("GLOBAL")
    ? `?filters=%5B%7B%22key%22%3A%22region%22%2C%22operator%22%3A%22%3D%3D%22%2C%22value%22%3A%22${userClaims?.regions[0]}%22%7D%5D`
    : "";

const TablesView = () => {
  const classes = useStyles();

  const [settingsDialogState, setSettingsDialogState] = useState<{
    mode: null | TableSettingsDialogModes;
    data: null | {
      collection: string;
      description: string;
      roles: string[];
      name: string;
      section: string;
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

  const { sections, userClaims } = useFiretableContext();
  const { userDoc } = useAppContext();

  const favs = userDoc.state.doc?.favoriteTables
    ? userDoc.state.doc.favoriteTables
    : [];

  const TableCard = ({ table }) => {
    const checked = Boolean(_find(favs, table));
    return (
      <Grid key={table.name} item xs={12} sm={6} md={4}>
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
                      ? favs.filter(t => t.collection !== table.collection)
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
            to: `${routes.table}/${table.collection}${regionalFilter(
              table?.regional ?? false,
              userClaims
            )}`,
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
    <>
      <main className={classes.root}>
        <AppBar />

        <Container>
          {favs.length !== 0 && (
            <section key={"favorites"} className={classes.section}>
              <Typography
                variant="subtitle2"
                component="h1"
                className={classes.sectionHeader}
              >
                favorites
              </Typography>
              <Divider className={classes.divider} />
              <Grid
                container
                spacing={4}
                justify="flex-start"
                className={classes.cardGrid}
              >
                {favs.map(table => (
                  <TableCard key={table.collection} table={table} />
                ))}
              </Grid>
            </section>
          )}

          {sections &&
            Object.keys(sections).map(sectionName => (
              <section key={sectionName} className={classes.section}>
                <Typography
                  variant="subtitle2"
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
                  {sections[sectionName].map(table => (
                    <TableCard key={table.collection} table={table} />
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
                onClick={() => {
                  setSettingsDialogState({
                    mode: TableSettingsDialogModes.create,
                    data: null,
                  });
                }}
              >
                <AddIcon />
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
    </>
  );
};

export default TablesView;
