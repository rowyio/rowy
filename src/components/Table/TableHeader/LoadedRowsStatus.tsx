import { Tooltip, Typography } from "@material-ui/core";

import { useProjectContext } from "contexts/ProjectContext";

export default function LoadedRowsStatus() {
  const { tableState } = useProjectContext();

  if (!tableState) return null;

  const allLoaded =
    !tableState.loadingRows && tableState.rows.length < tableState.queryLimit;

  return (
    <Tooltip
      title={
        allLoaded
          ? "All rows have been loaded in this table"
          : "Scroll to the bottom to load more rows"
      }
    >
      <Typography
        variant="body2"
        color="text.disabled"
        display="block"
        style={{ userSelect: "none", display: "flex", alignItems: "center" }}
      >
        Loaded {allLoaded && "all "}
        {tableState.rows.length} rows
      </Typography>
    </Tooltip>
  );
}
