import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Stack, TextField, IconButton } from "@mui/material";
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
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <Stack direction="row">
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
              size="small"
              href={
                typeof value !== "string" || value.includes("http")
                  ? value
                  : `https://${value}`
              }
              target="_blank"
              rel="noopener noreferrer"
              disabled={!value || typeof value !== "string"}
              edge="end"
              sx={{ ml: 1 }}
            >
              <LaunchIcon />
            </IconButton>
          </Stack>
        );
      }}
    />
  );
}
