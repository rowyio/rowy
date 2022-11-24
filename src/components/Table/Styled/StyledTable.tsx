import { styled } from "@mui/material";
import { colord } from "colord";

export const StyledTable = styled("div")(({ theme }) => ({
  "--cell-background-color":
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : colord(theme.palette.background.paper)
          .mix("#fff", 0.04)
          .alpha(1)
          .toHslString(),
  "--row-hover-background-color": colord(theme.palette.background.paper)
    .mix(theme.palette.action.hover, theme.palette.action.hoverOpacity)
    .alpha(1)
    .toHslString(),

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

  "& [data-frozen='left']": {
    position: "sticky",
    left: 0,
    zIndex: 2,

    "&[data-frozen-last='true']": {
      boxShadow: theme.shadows[2]
        .replace(/, 0 (\d+px)/g, ", $1 0")
        .split("),")
        .slice(1)
        .join("),"),
      clipPath: "inset(0 -4px 0 0)",
    },
  },
}));
StyledTable.displayName = "StyledTable";

export default StyledTable;
