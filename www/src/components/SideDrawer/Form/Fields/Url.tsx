import React from "react";
import { Controller, Control } from "react-hook-form";

import {
  Grid,
  TextField,
  FilledTextFieldProps,
  IconButton,
} from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";

export interface IUrlProps extends Omit<FilledTextFieldProps, "variant"> {
  control: Control;
  name: string;
}

export default function Url({ control, name, ...props }: IUrlProps) {
  return (
    <Grid container wrap="nowrap">
      <Controller
        control={control}
        name={name}
        render={({ onChange, onBlur, value }) => (
          <>
            <TextField
              variant="filled"
              fullWidth
              margin="none"
              placeholder={props.label as string}
              type="url"
              {...props}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              id={`sidedrawer-field-${name}`}
              label=""
              hiddenLabel
            />
            <IconButton
              component="a"
              href={value as string}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: 56 }}
              disabled={!value}
            >
              <LaunchIcon />
            </IconButton>
          </>
        )}
      />
    </Grid>
  );
}
