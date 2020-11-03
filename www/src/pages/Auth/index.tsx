import React, { useState } from "react";
import Div100vh from "react-div-100vh";

import {
  makeStyles,
  createStyles,
  Grid,
  Button,
  CircularProgress,
} from "@material-ui/core";

import { googleProvider, auth } from "../../firebase";
import useRouter from "hooks/useRouter";
import FiretableLogo from "assets/firetable-with-wordmark.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      padding: theme.spacing(3),

      margin: 0,
      width: "100%",
    },
    logo: { display: "block" },
  })
);

export default function AuthPage() {
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    await auth.signInWithPopup(googleProvider);
    router.history.replace("/");
  };

  return (
    <Grid
      container
      className={classes.root}
      spacing={4}
      direction="column"
      wrap="nowrap"
      justify="center"
      alignItems="center"
      component={Div100vh}
      style={{ minHeight: "100rvh" }}
    >
      <Grid item>
        <img
          src={FiretableLogo}
          alt="firetable"
          width={175}
          height={40}
          className={classes.logo}
        />
      </Grid>

      <Grid item>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            onClick={handleAuth}
            color="primary"
            size="large"
            variant="contained"
          >
            Sign in with Google
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
