import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Grid, TextField, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

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
              href={
                typeof value !== "string" || value.includes("http")
                  ? value
                  : `https://${value}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: 56, marginLeft: 16 }}
              disabled={!value || typeof value !== "string"}
            >
              <LaunchIcon />
            </IconButton>
          </Grid>
        );
      }}
    />
  );
}
