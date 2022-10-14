import { styled } from "@mui/material";

export const StyledCell = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "--cell-padding": theme.spacing(1.5),
  padding: "0 var(--cell-padding)",

  overflow: "visible",
  contain: "none",
  position: "relative",

  lineHeight: "calc(var(--row-height) - 1px)",

  borderBottom: `1px solid ${theme.palette.divider}`,
  borderLeft: `1px solid ${theme.palette.divider}`,
}));
StyledCell.displayName = "StyledCell";
