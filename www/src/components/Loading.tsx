import Div100vh from "react-div-100vh";

import {
  makeStyles,
  createStyles,
  Grid,
  CircularProgress,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      textAlign: "center",
    },
    progress: { color: theme.palette.text.secondary },
    content: { maxWidth: "25em" },
    message: {
      textTransform: "uppercase",
      marginTop: theme.spacing(1),
      letterSpacing: 1,
    },
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
      justify="center"
      alignItems="center"
      component={fullScreen ? Div100vh : "div"}
      style={{ height: fullScreen ? "100rvh" : "100%" }}
    >
      <Grid item className={classes.content}>
        <CircularProgress className={classes.progress} />
        <Typography
          variant="h6"
          className={classes.message}
          color="textSecondary"
        >
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
}
