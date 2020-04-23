import React from "react";
import { FieldProps } from "formik";

import { Link } from "react-router-dom";
import queryString from "query-string";
import useRouter from "hooks/useRouter";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  IconButton,
} from "@material-ui/core";

import LaunchIcon from "@material-ui/icons/Launch";

const useStyles = makeStyles(theme =>
  createStyles({
    labelContainer: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),

      textAlign: "left",
      minHeight: 56,
    },
  })
);

export default function SubTable({
  form,
  field,
  label,
  parentLabel,
}: FieldProps<any> & { parentLabel?: string; label: string }) {
  const classes = useStyles();

  const router = useRouter();
  const parentLabels = queryString.parse(router.location.search).parentLabel;

  let subTablePath = "";
  if (parentLabels)
    subTablePath =
      encodeURIComponent(`${form.values.ref.path}/${field.name}`) +
      `?parentLabel=${parentLabels},${
        parentLabel ? form.values[parentLabel] : ""
      }`;
  else
    subTablePath =
      encodeURIComponent(`${form.values.ref.path}/${field.name}`) +
      `?parentLabel=${
        parentLabel ? encodeURIComponent(form.values[parentLabel]) : ""
      }`;

  return (
    <Grid container wrap="nowrap">
      <Grid container alignItems="center" className={classes.labelContainer}>
        <Typography variant="body1">
          {label}
          {parentLabel && `: ${form.values[parentLabel]}`}
        </Typography>
      </Grid>

      <IconButton
        component={Link}
        to={subTablePath}
        style={{ width: 56 }}
        disabled={!subTablePath}
      >
        <LaunchIcon />
      </IconButton>
    </Grid>
  );
}
