import { styled, alpha } from "@mui/material";

export const StyledRow = styled("div")(({ theme }) => ({
  display: "flex",
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

  "& .row-hover-iconButton, .row-hover-iconButton:focus": {
    color: theme.palette.text.disabled,
    transitionDuration: "0s",

    flexShrink: 0,
    borderRadius: theme.shape.borderRadius,
    padding: (32 - 20) / 2,
    width: 32,
    height: 32,

    "&.end": { marginRight: theme.spacing(0.5) },
  },
  "&:hover .row-hover-iconButton, .row-hover-iconButton:focus": {
    color: theme.palette.text.primary,
    backgroundColor: alpha(
      theme.palette.action.hover,
      theme.palette.action.hoverOpacity * 1.5
    ),
  },
}));
StyledRow.displayName = "StyledRow";

export default StyledRow;
