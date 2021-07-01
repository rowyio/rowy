import clsx from "clsx";
import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import {
  createStyles,
  makeStyles,
  Grid,
  Typography,
  Avatar,
} from "@material-ui/core";
import { useFieldStyles } from "components/SideDrawer/Form/utils";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "constants/dates";

const useStyles = makeStyles((theme) =>
  createStyles({
    labelContainer: { cursor: "default" },

    avatar: {
      width: 32,
      height: 32,
      marginRight: theme.spacing(1.5),
    },
  })
);

export default function User({ control, column }: ISideDrawerFieldProps) {
  const classes = useStyles();
  const fieldClasses = useFieldStyles();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ value }) => {
        if (!value || !value.displayName || !value.timestamp)
          return <div className={fieldClasses.root} />;
        const dateLabel = format(
          value.timestamp.toDate ? value.timestamp.toDate() : value.timestamp,
          DATE_TIME_FORMAT
        );
        return (
          <Grid
            container
            alignItems="center"
            className={clsx(fieldClasses.root, classes.labelContainer)}
          >
            <Grid item>
              <Avatar
                alt="Avatar"
                src={value.photoURL}
                className={classes.avatar}
              />
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {value.displayName} ({value.email})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {dateLabel}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
