import Div100vh from "react-div-100vh";

import { makeStyles, createStyles } from "@material-ui/styles";
import { Grid, CircularProgress, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      textAlign: "center",
    },
    progress: { color: theme.palette.action.active },
    content: { maxWidth: "25em" },
    message: { marginTop: theme.spacing(1) },
  })
);
interface ILoading {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({
  message = "Loading",
  fullScreen = false,
}: ILoading) {
  const classes = useStyles({});

  return (
    <Grid
      container
      className={classes.root}
      direction="column"
      justifyContent="center"
      alignItems="center"
      component={fullScreen ? Div100vh : "div"}
      style={{ height: fullScreen ? "100rvh" : "100%" }}
    >
      <Grid item className={classes.content}>
        <CircularProgress className={classes.progress} />
        <Typography variant="h6" className={classes.message}>
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
}
