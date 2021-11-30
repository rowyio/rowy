import { Tooltip, Typography } from "@mui/material";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { CAP } from "@src/hooks/useTable/useTableData";

export default function LoadedRowsStatus() {
  const { tableState } = useProjectContext();

  if (!tableState) return null;

  const allLoaded =
    !tableState.loadingRows && tableState.rows.length < tableState.queryLimit;

  if (tableState.rows.length >= CAP)
    return (
      <Tooltip title={`Number of rows loaded is capped to ${CAP}`}>
        <Typography
          variant="body2"
          color="text.disabled"
          display="block"
          style={{ userSelect: "none" }}
        >
          Loaded {tableState.rows.length} row
          {tableState.rows.length !== 1 && "s"} (capped)
        </Typography>
      </Tooltip>
    );

  return (
    <Tooltip
      title={
        allLoaded
          ? "All rows have been loaded in this table"
          : `Scroll to the bottom to load more rows`
      }
    >
      <Typography
        variant="body2"
        color="text.disabled"
        display="block"
        style={{ userSelect: "none" }}
      >
        Loaded {allLoaded && "all "}
        {tableState.rows.length} row{tableState.rows.length !== 1 && "s"}
      </Typography>
    </Tooltip>
  );
}
