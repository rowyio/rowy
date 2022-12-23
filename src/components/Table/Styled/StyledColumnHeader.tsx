import {
  styled,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Stack,
} from "@mui/material";
import { COLUMN_HEADER_HEIGHT } from "@src/components/Table/Mock/Column";

export const StyledColumnHeader = styled(Stack)(({ theme }) => ({
  position: "relative",
  height: "100%",
  border: `1px solid ${theme.palette.divider}`,
  "& + &": { borderLeftStyle: "none" },

  flexDirection: "row",
  alignItems: "center",
  padding: theme.spacing(0, 0.5, 0, 1),
  "& svg, & button": { display: "block", zIndex: 1 },

  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.secondary,
  transition: theme.transitions.create("color", {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": { color: theme.palette.text.primary },

  "& .MuiIconButton-root": {
    color: theme.palette.text.disabled,
    transition: theme.transitions.create(
      ["background-color", "opacity", "color"],
      { duration: theme.transitions.duration.short }
    ),
  },
  [`&:hover .MuiIconButton-root,
    &:focus .MuiIconButton-root,
    &:focus-within .MuiIconButton-root,
    .MuiIconButton-root:focus`]: {
    color: theme.palette.text.primary,
    opacity: 1,
  },
}));
export default StyledColumnHeader;

export const StyledColumnHeaderNameTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,

    margin: `-${COLUMN_HEADER_HEIGHT - 1 - 2}px 0 0 !important`,
    padding: 0,
    paddingRight: theme.spacing(1.5),
  },
}));
