import { styled } from "@mui/material";

import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";

export const StyledRow = styled("div")(({ theme }) => ({
  display: "flex",
  height: DEFAULT_ROW_HEIGHT,
  position: "relative",

  "& > *": {
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 0,
  },

  "& [role='columnheader']": {
    "&:first-of-type": {
      borderTopLeftRadius: theme.shape.borderRadius,
    },
    "&:last-of-type": {
      borderTopRightRadius: theme.shape.borderRadius,
    },
  },

  "&:last-of-type": {
    "& [role='gridcell']:first-of-type": {
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    "& [role='gridcell']:last-of-type": {
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  },
}));
StyledRow.displayName = "StyledRow";

export default StyledRow;
