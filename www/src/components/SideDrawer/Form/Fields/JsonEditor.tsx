import React from "react";
import { FieldProps } from "formik";
import ReactJson from "react-json-view";

import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2),

      margin: 0,
      width: "100%",
      minHeight: 56,
      overflowX: "auto",
    },
  })
);

export default function JsonEditor({ form, field }: FieldProps) {
  const classes = useStyles();

  const handleEdit = edit => {
    form.setFieldValue(field.name, edit.updated_src);
  };

  return (
    <div className={classes.root}>
      <ReactJson
        src={field.value ? field.value : {}}
        onEdit={handleEdit}
        onAdd={handleEdit}
        onDelete={handleEdit}
        theme="bright:inverted"
        iconStyle="triangle"
        style={{
          fontFamily: "SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}
