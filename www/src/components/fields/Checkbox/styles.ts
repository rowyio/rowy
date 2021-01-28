import { makeStyles, createStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

export const useSwitchStyles = makeStyles(() =>
  createStyles({
    switchBase: {
      "&$checked": { color: green["A700"] },
      "&$checked + $track": { backgroundColor: green["A700"] },
    },
    checked: {},
    track: {},
  })
);
