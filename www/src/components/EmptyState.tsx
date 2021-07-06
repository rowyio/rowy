import clsx from "clsx";
import Div100vh from "react-div-100vh";

import {
  makeStyles,
  createStyles,
  Grid,
  GridProps,
  Typography,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

const useStyles = makeStyles((theme) =>
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

    basicIcon: { display: "block" },
  })
);

export interface IEmptyStateProps extends Partial<GridProps> {
  /** Primary message displayed under the icon */
  message?: React.ReactNode;
  /** Description text displayed under primary message */
  description?: React.ReactNode;
  /** Override icon component */
  Icon?: typeof ErrorIcon;
  /** Set height to `100vh`. Default: `false` */
  fullScreen?: boolean;
  /** Basic inline presentation without padding. Default: `false` */
  basic?: boolean;
}

/**
 * Display an empty state message with sensible defaults.
 * By default, height is `100%`.
 * Override with props that are passed to the root MUI `Grid` component.
 */
export default function EmptyState({
  message = "Nothing here",
  description,
  Icon = ErrorIcon,
  fullScreen = false,
  basic = false,
  ...props
}: IEmptyStateProps) {
  const classes = useStyles({});

  if (basic)
    return (
      <Grid container alignItems="center" spacing={1} {...props}>
        <Grid item>
          <Icon className={classes.basicIcon} />
        </Grid>

        <Grid item>
          {message}
          {description && ": "}
          {description}
        </Grid>
      </Grid>
    );

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      component={fullScreen ? Div100vh : "div"}
      style={{ height: fullScreen ? "100rvh" : "100%" }}
      {...props}
      className={clsx(classes.root, props.className)}
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
