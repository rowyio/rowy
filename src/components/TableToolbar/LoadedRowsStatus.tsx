import { Suspense, forwardRef } from "react";
import { useAtom } from "jotai";

import { Tooltip, Typography, TypographyProps } from "@mui/material";

import {
  tableScope,
  tableRowsAtom,
  tableNextPageAtom,
  serverDocCountAtom
} from "@src/atoms/tableScope";

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
  const [tableNextPage] = useAtom(tableNextPageAtom, tableScope);
  const [serverDocCount] = useAtom(serverDocCountAtom, tableScope)
  const [tableRows] = useAtom(tableRowsAtom, tableScope)
  if (tableNextPage.loading) return <StatusText>Loading more…</StatusText>;

  return (
    <Tooltip
      title={
        tableNextPage.available
          ? "Scroll to the bottom to load more rows"
          : "All rows have been loaded in this table"
      }
      describeChild
    >
      <StatusText>
        Loaded {!tableNextPage.available && "all "}
        {tableRows.length} {tableNextPage.available && `of ${serverDocCount}`} row{serverDocCount !== 1 && "s"}
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
