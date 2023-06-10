import { Suspense, forwardRef } from "react";
import { useAtom } from "jotai";

import { Tooltip, Typography, TypographyProps } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import OfflineIcon from "@mui/icons-material/CloudOffOutlined";

import {
  tableScope,
  tableRowsAtom,
  tableNextPageAtom,
  serverDocCountAtom,
} from "@src/atoms/tableScope";
import { spreadSx } from "@src/utils/ui";
import useOffline from "@src/hooks/useOffline";

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
      sx={[
        {
          userSelect: "none",

          "& svg": {
            fontSize: 20,
            width: "1em",
            height: "1em",
            verticalAlign: "bottom",
            display: "inline-block",
            mr: 0.75,
          },
        },
        ...spreadSx(props.sx),
      ]}
    />
  );
});

const loadingIcon = (
  <SyncIcon
    sx={{
      animation: "spin-infinite 1.5s linear infinite",
      "@keyframes spin-infinite": {
        from: { transform: "rotate(45deg)" },
        to: { transform: `rotate(${45 - 360}deg)` },
      },
    }}
  />
);

function LoadedRowsStatus() {
  const [tableNextPage] = useAtom(tableNextPageAtom, tableScope);
  const [serverDocCount] = useAtom(serverDocCountAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);

  if (tableNextPage.loading)
    return <StatusText>{loadingIcon}Loading more…</StatusText>;

  return (
    <Tooltip title="Syncing with database in realtime" describeChild>
      <StatusText>
        <SyncIcon style={{ transform: "rotate(45deg)" }} />
        Loaded {!tableNextPage.available && "all "}
        {tableRows.length}
        {serverDocCount !== undefined && ` of ${serverDocCount}`} row
        {(serverDocCount ?? tableRows.length) !== 1 && "s"}
      </StatusText>
    </Tooltip>
  );
}

export default function SuspendedLoadedRowsStatus() {
  const isOffline = useOffline();
  if (isOffline) {
    return (
      <Tooltip title="Changes will be saved when you reconnect" describeChild>
        <StatusText color="error.main">
          <OfflineIcon />
          Offline
        </StatusText>
      </Tooltip>
    );
  } else {
    return (
      <Suspense fallback={<StatusText>{loadingIcon}Loading…</StatusText>}>
        <LoadedRowsStatus />
      </Suspense>
    );
  }
}
