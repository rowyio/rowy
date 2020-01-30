import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme =>
  createStyles({
    typography: {
      padding: 1,
    },

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

    headerButton: {
      width: "100%",
    },
    tableActions: {
      display: "flex",
      flex: "wrap",
      alignContent: "center",
      // background: Theme.palette.primary.main,
    },
    formControl: {
      margin: 2,
      minWidth: 120,
    },
  })
);
export default useStyles;
