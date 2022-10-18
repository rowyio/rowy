import { styled } from "@mui/material";

export const StyledTable = styled("div")(({ theme }) => ({
  ...(theme.typography.caption as any),
  lineHeight: "inherit !important",

  "& [role='columnheader'], & [role='gridcell']": {
    "&[aria-selected='true']": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "-2px",
    },
    "&:focus": {
      outlineWidth: "3px",
      outlineOffset: "-3px",
    },
  },
}));
StyledTable.displayName = "StyledTable";
