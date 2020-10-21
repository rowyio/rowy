import React from "react";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import ImportIcon from "assets/icons/Import";

import { APP_BAR_HEIGHT } from "components/Navigation";
import { MONO_FONT } from "Theme";
import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
      width: 300,
      margin: "0 auto",
      textAlign: "center",
      userSelect: "none",
    },

    tablePath: {
      fontFamily: MONO_FONT,
      textTransform: "none",
    },
  })
);

export default function EmptyTableConfig() {
  const classes = useStyles();
  const { tableState, importWizardRef } = useFiretableContext();

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
          You can start by importing this existing data to your Firetable
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
      </Grid>
    </Grid>
  );
}
