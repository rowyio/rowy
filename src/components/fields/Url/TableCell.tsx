import { IBasicCellProps } from "../types";

import { Stack, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

export default function Url({ value }: IBasicCellProps) {
  if (!value || typeof value !== "string") return null;

  const href = value.includes("http") ? value : `https://${value}`;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      className="cell-collapse-padding"
      sx={{ p: "var(--cell-padding)", pr: 0.5 }}
    >
      <div style={{ flexGrow: 1, overflow: "hidden" }}>{value}</div>

      <IconButton
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="row-hover-iconButton"
        size="small"
        style={{ flexShrink: 0 }}
      >
        <LaunchIcon />
      </IconButton>
    </Stack>
  );
}
