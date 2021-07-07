import { makeStyles, createStyles } from "@material-ui/styles";
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
