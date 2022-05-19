import { useAtom } from "jotai";

import { Tooltip, Typography } from "@mui/material";

import {
  tableScope,
  tableRowsAtom,
  tableLoadingMoreAtom,
  tablePageAtom,
} from "@src/atoms/tableScope";
import { COLLECTION_PAGE_SIZE } from "@src/config/db";

export default function LoadedRowsStatus() {
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [tableLoadingMore] = useAtom(tableLoadingMoreAtom, tableScope);
  const [tablePage] = useAtom(tablePageAtom, tableScope);

  const allLoaded =
    !tableLoadingMore && tableRows.length < COLLECTION_PAGE_SIZE * tablePage;

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
        {tableRows.length} row{tableRows.length !== 1 && "s"}
      </Typography>
    </Tooltip>
  );
}
