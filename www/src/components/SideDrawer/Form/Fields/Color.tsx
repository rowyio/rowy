import React, { useState } from "react";
import { FieldProps } from "formik";
import { CompactPicker } from "react-color";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Collapse,
} from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      height: 56,
      cursor: "pointer",
    },
    colorIndicator: {
      width: 20,
      height: 20,
      marginLeft: 2,

      border: `1px solid ${theme.palette.text.disabled}`,
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
      >
        <Grid item>
          <div
            className={classes.colorIndicator}
            style={{ backgroundColor: field.value.hex }}
          />
        </Grid>

        <Grid item xs>
          <Typography
            variant="body2"
            color={field.value.hex ? "textPrimary" : "textSecondary"}
          >
            {field.value.hex ?? "Choose a color…"}
          </Typography>
        </Grid>
      </Grid>

      <Collapse in={showPicker}>
        <CompactPicker
          color={field.value.rgb}
          onChangeComplete={handleChangeComplete}
        />
      </Collapse>
    </>
  );
}
