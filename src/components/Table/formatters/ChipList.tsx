import { useAtom } from "jotai";

import { Grid } from "@mui/material";

import { tableScope, tableSchemaAtom } from "@src/atoms/tableScope";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";

export default function ChipList({ children }: React.PropsWithChildren<{}>) {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  const rowHeight = tableSchema.rowHeight ?? DEFAULT_ROW_HEIGHT;
  const canWrap = rowHeight > 24 * 2 + 4;

  return (
    <Grid
      container
      wrap={canWrap ? "wrap" : "nowrap"}
      alignItems="center"
      alignContent="flex-start"
      spacing={0.5}
      sx={{
        pl: 1,
        flexGrow: 1,
        overflow: "hidden",
        maxHeight: (theme) => `calc(100% + ${theme.spacing(0.5)})`,
        py: 0.5,

        "& .MuiChip-root": {
          height: 24,
          lineHeight: (theme) => theme.typography.caption.lineHeight,
          font: "inherit",
          letterSpacing: "inherit",
          display: "flex",
          cursor: "inherit",
        },
      }}
    >
      {children}
    </Grid>
  );
}
