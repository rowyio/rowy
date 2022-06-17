import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Stack, TextField, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import { getFieldId } from "@src/components/SideDrawer/utils";

export default function Url({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <Stack direction="row">
      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSubmit}
        value={value}
        id={getFieldId(column.key)}
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
        aria-label="Open in new tab"
      >
        <LaunchIcon />
      </IconButton>
    </Stack>
  );
}
