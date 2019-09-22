import React from "react";

import { maxWidth } from "@material-ui/system";
import {
  makeStyles,
  createStyles,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@material-ui/core";

import { googleProvider, auth } from "../firebase";
import useRouter from "../hooks/useRouter";

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      margin: "auto",
      minWidth: 275,
      maxWidth: 300,
    },
    button: {
      width: "100%",
    },
    header: {
      textAlign: "center",
    },
  })
);

// googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");

export default function AuthView() {
  const classes = useStyles();
  const router = useRouter();
  const handleAuth = async () => {
    await auth.signInWithPopup(googleProvider);
    router.history.replace("/");
  };
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.header}>Fire Table</Typography>
        <Button
          onClick={handleAuth}
          color="secondary"
          className={classes.button}
        >
          Authenticate With Google
        </Button>
      </CardContent>
    </Card>
  );
}
