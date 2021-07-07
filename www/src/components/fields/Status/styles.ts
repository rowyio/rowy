import { makeStyles, createStyles } from "@material-ui/styles";

export const useStatusStyles = makeStyles((theme) =>
  createStyles({
    root: { color: theme.palette.text.secondary },
    iconEmpty: { color: theme.palette.text.secondary },
  })
);
