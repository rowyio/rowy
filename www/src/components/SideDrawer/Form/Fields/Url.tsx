import React from "react";

import { Grid, IconButton } from "@material-ui/core";
import { TextField, TextFieldProps } from "formik-material-ui";

import LaunchIcon from "@material-ui/icons/Launch";

export default function Url(props: TextFieldProps) {
  return (
    <Grid container wrap="nowrap">
      <TextField
        variant="filled"
        fullWidth
        margin="none"
        placeholder={props.label as string}
        type="url"
        {...props}
        id={`sidedrawer-field-${props.field.name}`}
        label=""
        hiddenLabel
      />
      <IconButton
        component="a"
        href={props.field.value}
        target="_blank"
        rel="noopener noreferer"
        style={{ width: 56 }}
        disabled={!props.field.value}
      >
        <LaunchIcon />
      </IconButton>
    </Grid>
  );
}
