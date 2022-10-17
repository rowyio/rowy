import { styled } from "@mui/material";

export const StyledTable = styled("div")(({ theme }) => ({
  ...(theme.typography.caption as any),
  lineHeight: "inherit !important",

  "& [role='columnheader'], & [role='gridcell']": {
    "&[aria-selected='true']": {
      outline: `1px solid ${theme.palette.primary.main}`,
      outlineOffset: "-1px",
    },
    "&:focus": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "-2px",
    },
  },
}));
StyledTable.displayName = "StyledTable";
