import React from "react";
import Div100vh from "react-div-100vh";

import {
  makeStyles,
  createStyles,
  Grid,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      textAlign: "center",
    },

    content: { maxWidth: "25em" },

    icon: {
      color: theme.palette.text.disabled,
      fontSize: "3.5rem",
    },

    message: {
      textTransform: "uppercase",
      marginTop: theme.spacing(1),
      letterSpacing: 1,
    },
  })
);
interface IEmptyStateProps {
  message?: React.ReactNode;
  description?: React.ReactNode;
  Icon?: typeof ErrorIcon;
  fullScreen?: boolean;
}

export default function EmptyState({
  message = "Nothing here",
  description,
  Icon = ErrorIcon,
  fullScreen = false,
}: IEmptyStateProps) {
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
        <Icon className={classes.icon} />

        <Typography
          variant="h6"
          className={classes.message}
          color="textSecondary"
          gutterBottom
        >
          {message}
        </Typography>

        {description && (
          <Typography color="textSecondary" variant="body2">
            {description}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
