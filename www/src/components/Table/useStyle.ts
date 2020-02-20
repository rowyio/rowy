import { createStyles, makeStyles, fade } from "@material-ui/core/styles";

const useStyles = makeStyles(theme =>
  createStyles({
    "@global": {
      ".react-grid-Grid": {
        ...theme.typography.body2,
        fontSize: "0.75rem",
        lineHeight: 1.25,
        color: theme.palette.text.secondary,
      },
    },
  })
);
export default useStyles;
