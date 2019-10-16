import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(Theme => {
  return createStyles({
    typography: {
      padding: 1,
    },
    header: {
      display: "flex",
      flex: "wrap",
      alignContent: "center",
      justifyContent: "space-between",
    },
    headerLabel: {
      display: "flex",
      flex: "wrap",
      alignContent: "center",
    },
    headerButton: {
      width: "100%",
    },
    tableHeader: {
      padding: 8,
      width: "100%",
      display: "flex",
      flex: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      // background: Theme.palette.primary.main,
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
  });
});
export default useStyles;
