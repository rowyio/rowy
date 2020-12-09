import React from "react";
import { IFieldProps } from "../utils";

import { createStyles, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    labelContainer: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),

      textAlign: "left",
      minHeight: 56,

      display: "flex",
      alignItems: "center",
    },
    label: {
      whiteSpace: "normal",
      width: "100%",
      overflow: "hidden",
      fontFamily: theme.typography.fontFamilyMono,
      userSelect: "all",
    },
  })
);

export default function Id({ docRef }: IFieldProps) {
  const classes = useStyles();

  return (
    <div className={classes.labelContainer}>
      <Typography variant="body1" className={classes.label}>
        {docRef.id}
      </Typography>
    </div>
  );
}
