import { makeStyles, createStyles, fade } from "@material-ui/core";

export const useStyles = makeStyles(theme =>
  createStyles({
    "@global": {
      ".rdg-root": {
        "&.rdg-root": {
          border: "none",
          lineHeight: "inherit !important",
        },

        "& .rdg-header": { backgroundColor: theme.palette.background.default },
        "& .rdg-header .rdg-cell": { borderTop: "1px solid #e0e0e0" },

        "& .rdg-viewport": { backgroundColor: "transparent" },

        "& .rdg-cell": {
          borderColor: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          padding: theme.spacing(0, 1.5),
        },

        "& .rdg-cell-value": {
          width: "100%",
          maxHeight: "100%",
        },
      },

      ".rdg-viewport, .rdg-editor-container": {
        ...theme.typography.body2,
        fontSize: "0.75rem",
        lineHeight: "inherit",
        color: theme.palette.text.secondary,
      },

      ".rdg-row:hover": { color: theme.palette.text.primary },

      ".row-hover-iconButton": {
        color: theme.palette.text.disabled,

        ".rdg-row:hover &": {
          color: theme.palette.text.primary,
          backgroundColor: fade(
            theme.palette.text.primary,
            theme.palette.action.hoverOpacity * 2
          ),
        },
      },

      ".cell-collapse-padding": {
        margin: theme.spacing(0, -1.5),
        width: `calc(100% + ${theme.spacing(3)}px)`,
      },
    },
  })
);

export default useStyles;
