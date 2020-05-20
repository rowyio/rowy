import React, { Suspense } from "react";

import { makeStyles, createStyles, Grid, Typography } from "@material-ui/core";
import DebugIcon from "@material-ui/icons/BugReportOutlined";

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
        <Typography variant="body2" className={classes.disabledText}>
          {debugText}
        </Typography>
      )}
    </Grid>
  );
}
