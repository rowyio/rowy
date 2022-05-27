import { Suspense, forwardRef } from "react";
import { useAtom } from "jotai";

import { Tooltip, Typography, TypographyProps } from "@mui/material";

import {
  tableScope,
  tableRowsAtom,
  tableLoadingMoreAtom,
  tablePageAtom,
} from "@src/atoms/tableScope";
import { COLLECTION_PAGE_SIZE } from "@src/config/db";

const StatusText = forwardRef(function StatusText(
  props: TypographyProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <Typography
      ref={ref}
      variant="body2"
      color="text.disabled"
      display="block"
      {...props}
      style={{ userSelect: "none", ...props.style }}
    />
  );
});

function LoadedRowsStatus() {
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [tableLoadingMore] = useAtom(tableLoadingMoreAtom, tableScope);
  const [tablePage] = useAtom(tablePageAtom, tableScope);

  if (tableLoadingMore) return <StatusText>Loading more…</StatusText>;

  const allLoaded = tableRows.length < COLLECTION_PAGE_SIZE * (tablePage + 1);

  return (
    <Tooltip
      title={
        allLoaded
          ? "All rows have been loaded in this table"
          : "Scroll to the bottom to load more rows"
      }
    >
      <StatusText>
        Loaded {allLoaded && "all "}
        {tableRows.length} row{tableRows.length !== 1 && "s"}
      </StatusText>
    </Tooltip>
  );
}

export default function SuspendedLoadedRowsStatus() {
  return (
    <Suspense fallback={<StatusText>Loading…</StatusText>}>
      <LoadedRowsStatus />
    </Suspense>
  );
}
