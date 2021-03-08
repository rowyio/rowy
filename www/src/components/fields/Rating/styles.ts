import { makeStyles, createStyles } from "@material-ui/core";

export const useRatingStyles = makeStyles((theme) =>
  createStyles({
    root: { color: theme.palette.text.secondary },
    iconEmpty: { color: theme.palette.text.secondary },
  })
);
