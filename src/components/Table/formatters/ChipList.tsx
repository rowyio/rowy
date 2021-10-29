import { Grid } from "@mui/material";
import { useProjectContext } from "@src/contexts/ProjectContext";

export default function ChipList({ children }: React.PropsWithChildren<{}>) {
  const { tableState } = useProjectContext();

  const rowHeight = tableState?.config.rowHeight ?? 41;
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
