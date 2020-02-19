import React from "react";

import "tinymce/tinymce.min.js";
import "tinymce/themes/silver";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/paste";
import "tinymce/plugins/help";
import { Editor } from "@tinymce/tinymce-react";

import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      "& .tox-tinymce": { borderRadius: theme.shape.borderRadius },
    },
  })
);

export interface IRichTextProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function RichText({ value, onChange }: IRichTextProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Editor
        initialValue={value}
        init={{
          height: 300,
          menubar: false,
          plugins: ["lists link image", "paste help"],
          statusbar: false,
          toolbar:
            "formatselect | bold italic forecolor | link | bullist numlist outdent indent | removeformat | help",
        }}
        onEditorChange={onChange}
      />
    </div>
  );
}
