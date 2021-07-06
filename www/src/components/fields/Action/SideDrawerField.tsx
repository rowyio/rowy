import { Controller, useWatch } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Link,
} from "@material-ui/core";

import ActionFab from "./ActionFab";
import { useFieldStyles } from "components/SideDrawer/Form/utils";
import { sanitiseCallableName, isUrl } from "utils/fns";

const useStyles = makeStyles((theme) =>
  createStyles({
    labelGridItem: { width: `calc(100% - 56px - ${theme.spacing(2)}px)` },
    label: {
      whiteSpace: "normal",
      width: "100%",
      overflow: "hidden",
    },
  })
);

export default function Action({
  column,
  control,
  docRef,
  disabled,
}: ISideDrawerFieldProps) {
  const classes = useStyles();
  const fieldClasses = useFieldStyles();

  const row = useWatch({ control });

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, value }) => {
        const hasRan = value && value.status;

        return (
          <Grid container alignItems="center" wrap="nowrap" spacing={2}>
            <Grid item xs className={classes.labelGridItem}>
              <div className={fieldClasses.root}>
                <Typography variant="body1" className={classes.label}>
                  {hasRan && isUrl(value.status) ? (
                    <Link
                      href={value.status}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      underline="always"
                    >
                      {value.status}
                    </Link>
                  ) : hasRan ? (
                    value.status
                  ) : (
                    sanitiseCallableName(column.key)
                  )}
                </Typography>
              </div>
            </Grid>

            <Grid item>
              <ActionFab
                row={{ ...row, ref: docRef }}
                column={{ config: column.config, key: column.key }}
                onSubmit={onChange}
                value={value}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
