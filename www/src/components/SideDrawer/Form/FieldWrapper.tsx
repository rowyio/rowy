import React, { Suspense } from "react";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  IconButton,
} from "@material-ui/core";
import DebugIcon from "@material-ui/icons/BugReportOutlined";
import LaunchIcon from "@material-ui/icons/Launch";

import ErrorBoundary from "components/ErrorBoundary";
import FieldSkeleton from "./FieldSkeleton";

import { FieldType, getFieldIcon } from "constants/fields";

const useStyles = makeStyles(theme =>
  createStyles({
    header: {
      marginBottom: theme.spacing(1),
      color: theme.palette.text.disabled,
    },
    iconContainer: {
      marginRight: theme.spacing(0.5),
      "& svg": { display: "block" },
    },

    disabledText: {
      paddingLeft: theme.spacing(3 + 0.5),
      color: theme.palette.text.disabled,

      whiteSpace: "normal",
      wordBreak: "break-all",
    },
    launchButton: { margin: theme.spacing(-4, 0.5, 0, 0) },
  })
);

export interface IFieldWrapperProps {
  children?: React.ReactNode;
  type: FieldType | "debug";
  name?: string;
  label?: React.ReactNode;
  debugText?: React.ReactNode;
}

export default function FieldWrapper({
  children,
  type,
  name,
  label,
  debugText,
}: IFieldWrapperProps) {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Grid
        container
        alignItems="center"
        className={classes.header}
        component="label"
        id={`sidedrawer-label-${name}`}
        htmlFor={`sidedrawer-field-${name}`}
      >
        <Grid item className={classes.iconContainer}>
          {type === "debug" ? <DebugIcon /> : getFieldIcon(type)}
        </Grid>
        <Grid item xs>
          <Typography variant="caption">{label}</Typography>
        </Grid>
      </Grid>

      <ErrorBoundary fullScreen={false} basic>
        <Suspense fallback={<FieldSkeleton />}>
          {children ??
            (!debugText && (
              <Typography variant="body2" className={classes.disabledText}>
                This field can’t be edited here.
              </Typography>
            ))}
        </Suspense>
      </ErrorBoundary>

      {debugText && (
        <Grid container spacing={1} wrap="nowrap" alignItems="center">
          <Grid item xs>
            <Typography variant="body2" className={classes.disabledText}>
              {debugText}
            </Typography>
          </Grid>

          <Grid item>
            <IconButton
              component="a"
              href={`https://console.firebase.google.com/project/${
                process.env.REACT_APP_FIREBASE_PROJECT_ID
              }/firestore/data~2F${(debugText as string).replace(
                /\//g,
                "~2F"
              )}`}
              target="_blank"
              rel="noopener"
              aria-label="Open in Firebase Console"
              className={classes.launchButton}
            >
              <LaunchIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
