import { IDisplayCellProps } from "@src/components/fields/types";
import { Link } from "react-router-dom";

import { Stack, IconButton } from "@mui/material";
import OpenIcon from "@mui/icons-material/OpenInBrowser";

import { useSubTableData } from "./utils";

export default function ArraySubTable({
  column,
  row,
  _rowy_ref,
  tabIndex,
}: IDisplayCellProps) {
  const { documentCount, label, subTablePath } = useSubTableData(
    column as any,
    row,
    _rowy_ref
  );

  if (!_rowy_ref) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ paddingLeft: "var(--cell-padding)", width: "100%" }}
    >
      <div style={{ flexGrow: 1, overflow: "hidden" }}>
        {documentCount} {column.name as string}: {label}
      </div>

      <IconButton
        component={Link}
        to={subTablePath}
        className="row-hover-iconButton end"
        size="small"
        disabled={!subTablePath}
        tabIndex={tabIndex}
      >
        <OpenIcon />
      </IconButton>
    </Stack>
  );
}
