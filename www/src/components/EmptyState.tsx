import clsx from "clsx";
import Div100vh from "react-div-100vh";

import { makeStyles, createStyles } from "@material-ui/styles";
import {
  Grid,
  GridProps,
  Stack,
  Typography,
  SvgIconTypeMap,
} from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import ErrorIcon from "@material-ui/icons/ErrorOutline";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      textAlign: "center",

      ...theme.typography.body2,
    },

    content: {
      "&&": { maxWidth: "25em" },
    },

    icon: {
      color: theme.palette.action.active,
      fontSize: "3rem",
    },

    message: {
      marginTop: theme.spacing(1),
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
  Icon?: OverridableComponent<SvgIconTypeMap>;
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
  message = "Nothing Here",
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
      justifyContent="center"
      alignItems="center"
      component={fullScreen ? Div100vh : "div"}
      style={{ height: fullScreen ? "100rvh" : "100%" }}
      {...props}
      className={clsx(classes.root, props.className)}
    >
      <Grid item className={classes.content}>
        <Icon className={classes.icon} />

        <Typography
          component="h1"
          variant="h6"
          className={classes.message}
          gutterBottom
        >
          {message}
        </Typography>

        {description && (
          <Stack spacing={2} alignItems="center">
            {description}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
