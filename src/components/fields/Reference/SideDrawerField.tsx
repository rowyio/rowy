import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Stack, TextField, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { useAppContext } from "@src/contexts/AppContext";

export default function Reference({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const { projectId } = useAppContext();
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => {
        const path = value ?? value.path;
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
              href={`https://console.firebase.google.com/u/0/project/${projectId}/firestore/data/~2F${encodeURIComponent(
                path
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              disabled={true}
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
