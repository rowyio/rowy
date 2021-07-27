import {
  makeStyles,
  createStyles,
  Snackbar,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import { useSnackContext } from "contexts/SnackContext";
import antlerPalette from "Theme/antlerPalette";

const useStyles = makeStyles((theme) =>
  createStyles({
    progressAction: { marginRight: 0 },
    progressText: { marginLeft: theme.spacing(2) },
    progress: {
      color: antlerPalette.green[100],
      marginLeft: theme.spacing(2),
    },

    alertIcon: { padding: 0 },
    alertMessage: { padding: theme.spacing(0.75, 2) },
  })
);

export default function Snack() {
  const classes = useStyles();

  const {
    position,
    isOpen,
    close,
    message,
    duration,
    action,
    variant,
    progress,
  } = useSnackContext();

  if (variant === "progress")
    return (
      <Snackbar
        anchorOrigin={position}
        open={isOpen}
        onClose={close}
        message={message}
        action={
          <>
            <span className={classes.progressText}>
              {progress.value}
              {progress.target && `/${progress.target}`}
            </span>

            <CircularProgress
              variant={progress.value ? "static" : "indeterminate"}
              value={
                progress.target
                  ? (progress.value / progress.target) * 100
                  : progress.value
              }
              size={24}
              className={classes.progress}
            />
          </>
        }
        ContentProps={{ classes: { action: classes.progressAction } }}
        // Stop closing when user clicks
        ClickAwayListenerProps={{ mouseEvent: false }}
      />
    );

  if (!variant)
    return (
      <Snackbar
        anchorOrigin={position}
        open={isOpen}
        onClose={close}
        autoHideDuration={duration}
        message={message}
        action={action}
        ClickAwayListenerProps={{ mouseEvent: false }}
        onClick={close}
      />
    );

  return (
    <Snackbar
      anchorOrigin={position}
      open={isOpen}
      onClose={close}
      autoHideDuration={duration}
      ClickAwayListenerProps={{ mouseEvent: false }}
      onClick={close}
    >
      <Alert
        variant="filled"
        action={action}
        severity={variant}
        classes={{ icon: classes.alertIcon, message: classes.alertMessage }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
