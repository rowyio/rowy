import { createStyles, makeStyles, fade } from "@material-ui/core/styles";

const useStyles = makeStyles(theme =>
  createStyles({
    header: {},

    columnIconContainer: {
      "& > svg": { display: "block" },
    },
    columnNameContainer: {
      flexShrink: 1,
      overflow: "hidden",
      margin: theme.spacing(0, 0.5),
    },
    columnName: {
      fontSize: "0.875rem",
      lineHeight: 1,
    },

    "@global": {
      ".react-grid-Grid": {
        ...theme.typography.body2,
        fontSize: "0.75rem",
        lineHeight: 1.25,
        color: theme.palette.text.secondary,
      },
    },

    dropdownButton: {
      color: fade(theme.palette.text.primary, 0.3),
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.shortest,
      }),
      "&:hover": { color: theme.palette.text.secondary },
    },
  })
);
export default useStyles;
