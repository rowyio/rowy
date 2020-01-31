import React, { useContext } from "react";

import {
  createStyles,
  makeStyles,
  Container,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";

import useSettings from "../hooks/useSettings";
import routes from "../constants/routes";
import { AppContext } from "../AppProvider";

import AppBar from "../components/AppBar";
import Loading from "components/Loading";
import GoIcon from "../components/GoIcon";
import StyledCard from "../components/StyledCard";
import CreateTableDialog from "../components/CreateTableDialog";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { minHeight: "100vh", paddingBottom: theme.spacing(8) },

    greeting: {
      textTransform: "uppercase",
      letterSpacing: 3,
      display: "inline-block",
      verticalAlign: "middle",
    },
    newChip: {
      ...theme.typography.overline,
      backgroundColor: theme.palette.text.secondary,
      color: theme.palette.getContrastText(theme.palette.text.secondary),
      marginLeft: theme.spacing(4),
    },
    newChipLabel: { padding: theme.spacing(0, 2) },
    divider: {
      margin: theme.spacing(2, 0, 4),
    },

    cardGrid: {
      [theme.breakpoints.down("xs")]: { maxWidth: 360, margin: "0 auto" },
    },
    card: {
      height: "100%",
      [theme.breakpoints.up("md")]: { minHeight: 220 },
      [theme.breakpoints.down("md")]: { minHeight: 180 },
    },

    createTableContainer: {
      alignSelf: "flex-end",
      marginLeft: "auto",
    },
    createTableFab: {
      width: 80,
      height: 80,
      borderRadius: theme.shape.borderRadius * 2,
      "& svg": { width: "2em", height: "2em" },
    },
  })
);

const TablesView = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AppContext);

  const [settings, createTable] = useSettings();
  const tables = settings.tables;

  return (
    <main className={classes.root}>
      <AppBar />

      <Container>
        <Grid container spacing={2} justify="center">
          <Grid item xs>
            <Typography
              variant="h5"
              color="textSecondary"
              component="h2"
              className={classes.greeting}
            >
              Hi {currentUser!.displayName!.split(" ")[0]}!
            </Typography>

            {/* <Chip
              label="1 New"
              size="small"
              classes={{ root: classes.newChip, label: classes.newChipLabel }}
            /> */}
          </Grid>

          {/* <Grid item>
            <Button color="primary" component={Link} to="" endIcon={<GoIcon />}>
              Manage Team
            </Button>
          </Grid> */}
        </Grid>

        <Divider className={classes.divider} />

        <Grid
          container
          spacing={4}
          justify="space-between"
          className={classes.cardGrid}
        >
          {Array.isArray(tables) ? (
            tables.map((table: any) => (
              <Grid key={table.name} item xs={12} sm={6} md={4}>
                <StyledCard
                  className={classes.card}
                  overline="Primary"
                  title={table.name}
                  bodyContent={table.description}
                  primaryLink={{
                    to: `${routes.table}/${table.collection}`,
                    label: "Open",
                  }}
                />
              </Grid>
            ))
          ) : (
            <Loading />
          )}

          <Grid item className={classes.createTableContainer}>
            <CreateTableDialog
              createTable={createTable}
              classes={{ fab: classes.createTableFab }}
            />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default TablesView;
