import { makeStyles, createStyles, fade } from "@material-ui/core";
import { APP_BAR_HEIGHT } from "components/Navigation";

export const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".rdg-root": {
        "&.rdg-root": {
          border: "none",
          lineHeight: "inherit !important",
        },

        "& .rdg-header, & .rdg-header .rdg-cell": {
          backgroundColor: theme.palette.background.default,
        },
        "& .rdg-header .rdg-cell": {
          borderTop: "1px solid #e0e0e0",
          height: "100%",
        },

        "& .rdg-viewport": { backgroundColor: "transparent" },

        "& .rdg-cell": {
          borderColor: "#e0e0e0",
          display: "inline-flex",
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

      ".rdg-draggable-header-cell": {
        cursor: "move",
        display: "inline",

        "&.rdg-can-drop .rdg-cell": { backgroundColor: theme.palette.divider },
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
    wrapper: {
      display: "flex",
      flexDirection: "column",
      height: "700px!important",
      rdg: {
        flex: 1,
        height: "700px!important",
      },
    },

    loadingContainer: {
      position: "sticky",
      left: 0,
      height: 100,
    },
  })
);

export default useStyles;
