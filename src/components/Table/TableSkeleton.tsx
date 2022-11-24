import { Suspense } from "react";
import { useAtom } from "jotai";
import { colord } from "colord";

import { Fade, Stack, Skeleton, Button } from "@mui/material";
import { AddColumn as AddColumnIcon } from "@src/assets/icons";
import Column from "./Mock/Column";

import { projectScope, userSettingsAtom } from "@src/atoms/projectScope";
import {
  tableScope,
  tableIdAtom,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import { DEFAULT_ROW_HEIGHT, DEFAULT_COL_WIDTH, TABLE_PADDING } from "./Table";
import { COLLECTION_PAGE_SIZE } from "@src/config/db";
import { formatSubTableName } from "@src/utils/table";

const NUM_COLS = 5;
const NUM_ROWS = COLLECTION_PAGE_SIZE;

export function HeaderRowSkeleton() {
  return (
    <Fade in timeout={1000} style={{ transitionDelay: "1s" }} unmountOnExit>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          marginLeft: (theme) =>
            `max(env(safe-area-inset-left), ${theme.spacing(2)})`,
          marginRight: `env(safe-area-inset-right)`,
        }}
      >
        {new Array(NUM_COLS + 1).fill(undefined).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            sx={{
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
              borderLeftWidth: i === 0 ? 1 : 0,
              width: i === NUM_COLS ? 46 : DEFAULT_COL_WIDTH,
              height: DEFAULT_ROW_HEIGHT + 1,
              borderRadius: i === NUM_COLS ? 1 : 0,
              borderTopLeftRadius:
                i === 0 ? (theme) => theme.shape.borderRadius : 0,
              borderBottomLeftRadius:
                i === 0 ? (theme) => theme.shape.borderRadius : 0,
            }}
          />
        ))}

        <Skeleton
          sx={{ transform: "none", ml: (-46 + 6) / 8, borderRadius: 1 }}
        >
          <Button variant="contained" startIcon={<AddColumnIcon />}>
            Add column
          </Button>
        </Skeleton>
      </Stack>
    </Fade>
  );
}

const useDisplayedColumns = () => {
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const userDocHiddenFields =
    userSettings.tables?.[formatSubTableName(tableId)]?.hiddenFields;

  return tableColumnsOrdered.filter((column) => {
    if (column.hidden) return false;
    if (
      Array.isArray(userDocHiddenFields) &&
      userDocHiddenFields.includes(column.key)
    )
      return false;
    return true;
  });
};

export function StaticHeaderRow() {
  const columns = useDisplayedColumns();

  return (
    <Stack
      direction="row"
      sx={{
        px: 2,
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
        "& > div + div": { borderLeftWidth: 0 },
        "& > div:first-of-type": {
          borderTopLeftRadius: (theme) => theme.shape.borderRadius,
        },
        "& > div:last-of-type": {
          borderTopRightRadius: (theme) => theme.shape.borderRadius,
        },
      }}
    >
      {columns.map((col) => (
        <Column
          key={col.key}
          label={col.name}
          type={col.type}
          style={{
            width: col.width || DEFAULT_COL_WIDTH,
            flexShrink: 0,
            pointerEvents: "none",
          }}
        />
      ))}
    </Stack>
  );
}

export function RowsSkeleton() {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const columns = useDisplayedColumns();
  const rowHeight = tableSchema.rowHeight ?? DEFAULT_ROW_HEIGHT;

  return (
    <>
      {new Array(NUM_ROWS + 1).fill(undefined).map((_, i) => (
        <Stack
          key={i}
          direction="row"
          style={{ padding: `0 ${TABLE_PADDING}px`, marginTop: -1 }}
        >
          {columns.map((col, j) => (
            <Skeleton
              key={col.key}
              variant="rectangular"
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.background.paper
                    : colord(theme.palette.background.paper)
                        .mix("#fff", 0.04)
                        .alpha(1)
                        .toHslString(),
                border: "1px solid",
                borderColor: "divider",
                borderLeftWidth: j === 0 ? 1 : 0,
                borderRadius: 0,
                width: col.width || DEFAULT_COL_WIDTH,
                flexShrink: 0,
                height: rowHeight + 1,

                animationName: "pulsate-full",
                animationDelay: `${(1500 / NUM_ROWS) * i}ms`,
                animationFillMode: "both",
                "@keyframes pulsate-full": {
                  "0%": { opacity: 0 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0 },
                },
              }}
            />
          ))}
        </Stack>
      ))}
    </>
  );
}

export default function TableSkeleton() {
  return (
    <Suspense fallback={<HeaderRowSkeleton />}>
      <StaticHeaderRow />
      <RowsSkeleton />
    </Suspense>
  );
}
