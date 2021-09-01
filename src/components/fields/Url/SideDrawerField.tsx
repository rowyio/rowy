import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Grid, TextField, IconButton } from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";

export default function Url({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        return (
          <Grid container wrap="nowrap">
            <TextField
              variant="filled"
              fullWidth
              margin="none"
              placeholder={column.name}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              id={`sidedrawer-field-${column.key}`}
              label=""
              hiddenLabel
              disabled={disabled}
              type="url"
            />
            <IconButton
              component="a"
              href={value.includes("http") ? value : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: 56, marginLeft: 16 }}
              disabled={!value}
            >
              <LaunchIcon />
            </IconButton>
          </Grid>
        );
      }}
    />
  );
}
