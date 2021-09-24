import React, { Suspense } from "react";

import { makeStyles, createStyles } from "@mui/styles";
import { Grid, Typography, IconButton } from "@mui/material";
import DebugIcon from "@mui/icons-material/BugReportOutlined";
import LaunchIcon from "@mui/icons-material/Launch";
import LockIcon from "@mui/icons-material/LockOutlined";

import ErrorBoundary from "components/ErrorBoundary";
import FieldSkeleton from "./FieldSkeleton";

import { FieldType } from "constants/fields";
import { getFieldProp } from "components/fields";
import { useAppContext } from "contexts/AppContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    header: {
      padding: theme.spacing(3 / 8, 0),
      color: theme.palette.text.secondary,

      "& svg": {
        display: "block",
        fontSize: 18,
      },
    },
    iconContainer: {
      marginRight: theme.spacing(0.75),
    },

    label: {
      ...theme.typography.caption,
      lineHeight: "18px",
      fontWeight: 500,
    },

    disabledText: {
      paddingLeft: theme.spacing(18 / 8 + 1),
      color: theme.palette.text.disabled,

      whiteSpace: "normal",
      wordBreak: "break-all",
    },
    launchButton: { margin: theme.spacing(-3, -1.5, 0, 0) },
  })
);

export interface IFieldWrapperProps {
  children?: React.ReactNode;
  type: FieldType | "debug";
  name?: string;
  label?: React.ReactNode;
  debugText?: React.ReactNode;
  disabled?: boolean;
}

export default function FieldWrapper({
  children,
  type,
  name,
  label,
  debugText,
  disabled,
}: IFieldWrapperProps) {
  const classes = useStyles();

  const { projectId } = useAppContext();

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
          {type === "debug" ? <DebugIcon /> : getFieldProp("icon", type)}
        </Grid>
        <Grid item xs component={Typography} className={classes.label}>
          {label}
        </Grid>
        {disabled && (
          <Grid item>
            <LockIcon />
          </Grid>
        )}
      </Grid>

      <ErrorBoundary fullScreen={false} basic>
        <Suspense fallback={<FieldSkeleton />}>
          {children ??
            (!debugText && (
              <Typography variant="body2" className={classes.disabledText}>
                This field cannot be edited here
              </Typography>
            ))}
        </Suspense>
      </ErrorBoundary>

      {debugText && (
        <Grid container spacing={1} wrap="nowrap" alignItems="center">
          <Grid item xs>
            <Typography
              variant="body2"
              className={classes.disabledText}
              style={{ userSelect: "all" }}
            >
              {debugText}
            </Typography>
          </Grid>

          <Grid item>
            <IconButton
              component="a"
              href={`https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${(
                debugText as string
              ).replace(/\//g, "~2F")}`}
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
