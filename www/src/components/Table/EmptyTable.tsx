import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import ImportIcon from "assets/icons/Import";
import AddColumnIcon from "assets/icons/AddColumn";

import { APP_BAR_HEIGHT } from "components/Navigation";

import { useFiretableContext } from "contexts/FiretableContext";
import ColumnMenu from "./ColumnMenu";
import ImportWizard from "components/Wizards/ImportWizard";
import ImportCSV from "./TableHeader/ImportCsv";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
      width: 300,
      margin: "0 auto",
      textAlign: "center",
      userSelect: "none",
    },

    tablePath: {
      fontFamily: theme.typography.fontFamilyMono,
      textTransform: "none",
    },
  })
);

export default function EmptyTable() {
  const classes = useStyles();
  const { tableState, importWizardRef, columnMenuRef } = useFiretableContext();

  if (tableState?.rows && tableState?.rows.length > 0)
    return (
      <Grid
        container
        direction="column"
        wrap="nowrap"
        alignItems="center"
        justify="center"
        spacing={2}
        className={classes.root}
      >
        <Grid item>
          <Typography variant="overline">
            You have existing data in your Firestore collection
            <br />
            <Typography
              variant="body2"
              component="span"
              className={classes.tablePath}
            >
              “{tableState?.tablePath}”
            </Typography>
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="overline">
            You can start by importing this existing data to this table
          </Typography>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ImportIcon />}
            onClick={() => importWizardRef?.current?.setOpen(true)}
          >
            Import
          </Button>

          <ImportWizard />
        </Grid>
      </Grid>
    );

  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      alignItems="center"
      justify="center"
      spacing={2}
      className={classes.root}
    >
      <Grid item>
        <Typography variant="overline">
          You have no data in this table
        </Typography>
      </Grid>

      <Grid item>
        <Typography variant="overline">
          You can start by importing data from an external CSV file
        </Typography>
      </Grid>

      <Grid item>
        <ImportCSV
          render={(onClick) => (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ImportIcon />}
              onClick={onClick}
            >
              Import CSV
            </Button>
          )}
          PopoverProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "center",
            },
          }}
        />
      </Grid>

      <Grid item />

      <Grid item>
        <Typography variant="overline">
          Or you can manually add new columns and rows
        </Typography>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddColumnIcon />}
          onClick={(event) =>
            columnMenuRef?.current?.setSelectedColumnHeader({
              column: { isNew: true, key: "new", type: "LAST" } as any,
              anchorEl: event.currentTarget,
            })
          }
          disabled={!columnMenuRef?.current}
        >
          Add Column
        </Button>

        <ColumnMenu />
      </Grid>
    </Grid>
  );
}
