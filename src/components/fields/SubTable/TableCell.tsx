import { IHeavyCellProps } from "../types";
import { Link } from "react-router-dom";

import { Stack, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import { useSubTableData } from "./utils";

export default function SubTable({ column, row }: IHeavyCellProps) {
  const { documentCount, label, subTablePath } = useSubTableData(
    column,
    row,
    row.ref
  );

  if (!row.ref) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      className="cell-collapse-padding"
      sx={{ p: "var(--cell-padding)", pr: 0.5 }}
    >
      <div style={{ flexGrow: 1, overflow: "hidden" }}>
        {documentCount} {column.name as string}: {label}
      </div>

      <IconButton
        component={Link}
        to={subTablePath}
        className="row-hover-iconButton"
        size="small"
        disabled={!subTablePath}
        style={{ flexShrink: 0 }}
      >
        <LaunchIcon />
      </IconButton>
    </Stack>
  );
}
