import { useState } from "react";
import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";
import { ChromePicker } from "react-color";

import {
  makeStyles,
  createStyles,
  Grid,
  ButtonBase,
  Typography,
  Collapse,
} from "@material-ui/core";

import { useFieldStyles } from "components/SideDrawer/Form/utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: 56,
      cursor: "pointer",
      textAlign: "left",
      borderRadius: theme.shape.borderRadius,

      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      margin: 0,
      width: "100%",
      padding: theme.spacing(0, 0.75),
    },

    colorIndicator: {
      width: 20,
      height: 20,
      marginLeft: 2,

      boxShadow: `0 0 0 1px ${theme.palette.text.disabled} inset`,
      borderRadius: theme.shape.borderRadius,
    },
  })
);

export default function Color({
  column,
  control,
  disabled,
}: ISideDrawerFieldProps) {
  const classes = useStyles();
  const fieldClasses = useFieldStyles();

  const [showPicker, setShowPicker] = useState(false);
  const toggleOpen = () => setShowPicker((s) => !s);

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => (
        <>
          <Grid
            container
            alignItems="center"
            spacing={1}
            className={classes.root}
            onClick={() => {
              toggleOpen();
              onBlur();
            }}
            component={ButtonBase}
            focusRipple
            disabled={disabled}
          >
            <Grid item>
              <div
                className={classes.colorIndicator}
                style={{ backgroundColor: value?.hex }}
              />
            </Grid>

            <Grid item xs>
              <Typography
                variant="body1"
                color={value?.hex ? "textPrimary" : "textSecondary"}
              >
                {value?.hex ?? "Choose a color…"}
              </Typography>
            </Grid>
          </Grid>

          <Collapse in={showPicker}>
            <ChromePicker color={value?.rgb} onChangeComplete={onChange} />
          </Collapse>
        </>
      )}
    />
  );
}
