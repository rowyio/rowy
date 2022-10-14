import { styled } from "@mui/material";

import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";

export const StyledRow = styled("div")(({ theme }) => ({
  display: "flex",
  height: DEFAULT_ROW_HEIGHT,

  backgroundColor: theme.palette.background.paper,
}));
StyledRow.displayName = "StyledRow";
