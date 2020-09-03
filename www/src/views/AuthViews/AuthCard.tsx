import React from "react";

import {
  makeStyles,
  createStyles,
  Typography,
  Card,
  Button,
  Grid,
  LinearProgress,
} from "@material-ui/core";

import logo from "assets/firetable-with-wordmark.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      maxWidth: 419,
      minWidth: 300,
      width: "100%",
      height: 360,
      margin: "auto",
      marginTop: 50,

      position: "relative",
    },

    progress: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
    },

    logo: { width: 150, height: 35, margin: "0 auto 20px" },

    grid: {
      height: "100%",
      padding: theme.spacing(4),
    },

    support: {
      margin: "auto",
      marginTop: theme.spacing(2),
      maxWidth: 400,
    },
    emailButtonLabel: {
      ...theme.typography.overline,
      color: theme.palette.primary.main,
    },
  })
);

export default function AuthCard({ children, height = 300, loading = false }) {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.card} style={{ height }}>
        {loading && <LinearProgress className={classes.progress} />}

        <Grid
          container
          direction="column"
          className={classes.grid}
          justify="space-between"
        >
          <img src={logo} className={classes.logo} />

          {children}
        </Grid>
      </Card>

      {/* <Grid
        className={classes.support}
        container
        direction="row"
        alignItems="baseline"
      >
        <Typography variant="overline">
          Having problems authenticating?
        </Typography>
        <Button
          color="primary"
          component="a"
          href="mailto:engineering@antler.co?subject=unable%20to%20authenticate%20an%20account"
          size="small"
          classes={{ label: classes.emailButtonLabel }}
          endIcon={<GoIcon />}
        >
          Email Us
        </Button>
      </Grid> */}
    </>
  );
}
