import React, { useState } from "react";
import { FieldProps } from "formik";
import { ChromePicker } from "react-color";

import {
  makeStyles,
  createStyles,
  ButtonBase,
  Grid,
  Typography,
  Collapse,
} from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      height: 56,
      cursor: "pointer",
      textAlign: "left",
      borderRadius: theme.shape.borderRadius,
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

export interface IColorProps extends FieldProps {}

export default function Color({ field, form }: IColorProps) {
  const classes = useStyles();

  const [showPicker, setShowPicker] = useState(false);
  const toggleOpen = () => setShowPicker(s => !s);

  const handleChangeComplete = color => {
    form.setFieldValue(field.name, color);
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        spacing={1}
        className={classes.root}
        onClick={toggleOpen}
        component={ButtonBase}
      >
        <Grid item>
          <div
            className={classes.colorIndicator}
            style={{ backgroundColor: field.value.hex }}
          />
        </Grid>

        <Grid item xs>
          <Typography
            variant="body1"
            color={field.value.hex ? "textPrimary" : "textSecondary"}
          >
            {field.value.hex ?? "Choose a color…"}
          </Typography>
        </Grid>
      </Grid>

      <Collapse in={showPicker}>
        <ChromePicker
          color={field.value.rgb}
          onChangeComplete={handleChangeComplete}
        />
      </Collapse>
    </>
  );
}
