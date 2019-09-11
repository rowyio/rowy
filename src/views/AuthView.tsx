import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { maxWidth } from "@material-ui/system";
import { googleProvider, auth } from "../firebase";

const useStyles = makeStyles({
  card: {
    margin: "auto",
    minWidth: 275,
    maxWidth: 300
  },
  button: {
    width: "100%"
  },
  header: {
    textAlign: "center"
  }
});

googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
function handleAuth() {
  auth.signInWithPopup(googleProvider);
}
export default function AuthView() {
  const classes = useStyles();

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
