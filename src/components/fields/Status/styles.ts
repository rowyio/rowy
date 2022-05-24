import { makeStyles } from "tss-react/mui";

export const useStatusStyles = makeStyles()((theme) => ({
  root: { color: theme.palette.text.secondary },
  iconEmpty: { color: theme.palette.text.secondary },
}));
