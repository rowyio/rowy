import { styled } from "@mui/material";

export const StyledTable = styled("div")(({ theme }) => ({
  ...(theme.typography.caption as any),
  lineHeight: "inherit !important",
}));
StyledTable.displayName = "StyledTable";
