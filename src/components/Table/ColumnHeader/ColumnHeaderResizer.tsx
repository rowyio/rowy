import { styled } from "@mui/material";

export interface IColumnHeaderResizerProps {
  isResizing: boolean;
}

export const ColumnHeaderResizer = styled("div", {
  name: "ColumnHeaderResizer",
  shouldForwardProp: (prop) => prop !== "isResizing",
})<IColumnHeaderResizerProps>(({ theme, isResizing }) => ({
  position: "absolute",
  zIndex: 5,
  right: 0,
  top: 0,
  height: "100%",
  width: 10,

  cursor: "col-resize",
  userSelect: "none",
  touchAction: "none",

  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",

  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
  opacity: isResizing ? 1 : 0,
  "[role='columnheader']:hover &": { opacity: 0.33 },
  "[role='columnheader'] &:hover, [role='columnheader'] &:active": {
    opacity: 1,
    "&::before": { transform: "scaleY(1.25)" },
  },

  "&::before": {
    content: "''",
    display: "block",

    height: "50%",
    width: 4,
    borderRadius: 2,
    marginRight: 2,

    background: isResizing
      ? theme.palette.primary.main
      : theme.palette.action.active,
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    transform: isResizing ? "scaleY(1.5) !important" : undefined,
  },
}));
ColumnHeaderResizer.displayName = "ColumnHeaderResizer";

export default ColumnHeaderResizer;
