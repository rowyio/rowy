import React, { useState } from "react";
import clsx from "clsx";

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
      "& .tox": {
        "&.tox-tinymce": {
          borderRadius: theme.shape.borderRadius,
          border: "none",
          backgroundColor:
            theme.palette.type === "light"
              ? "rgba(0, 0, 0, 0.09)"
              : "rgba(255, 255, 255, 0.09)",

          transition: theme.transitions.create("background-color", {
            duration: theme.transitions.duration.shorter,
            easing: theme.transitions.easing.easeOut,
          }),

          "&:hover": {
            backgroundColor:
              theme.palette.type === "light"
                ? "rgba(0, 0, 0, 0.13)"
                : "rgba(255, 255, 255, 0.13)",
          },
        },

        "& .tox-toolbar-overlord, & .tox-edit-area__iframe, & .tox-toolbar__primary": {
          background: "transparent",
        },

        "& .tox-toolbar__primary": { padding: theme.spacing(0.5, 0) },
        "& .tox-toolbar__group": {
          padding: theme.spacing(0, 1),
          border: "none !important",
        },

        "& .tox-tbtn": {
          borderRadius: theme.shape.borderRadius,
          color: theme.palette.text.secondary,
          cursor: "pointer",
          margin: 0,

          transition: theme.transitions.create(["color", "background-color"], {
            duration: theme.transitions.duration.shortest,
          }),

          "&:hover": {
            color: theme.palette.text.primary,
            backgroundColor: "transparent",
          },

          "& svg": { fill: "currentColor" },
        },

        "& .tox-tbtn--enabled, & .tox-tbtn--enabled:hover": {
          backgroundColor: theme.palette.action.selected + " !important",
          color: theme.palette.text.primary,
        },
      },
    },

    focus: {
      "& .tox.tox-tinymce": {
        backgroundColor:
          (theme.palette.type === "light"
            ? "rgba(0, 0, 0, 0.09)"
            : "rgba(255, 255, 255, 0.09)") + "!important",
      },
    },
  })
);

export interface IRichTextProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function RichText({ value, onChange }: IRichTextProps) {
  const classes = useStyles();
  const [focus, setFocus] = useState(false);

  return (
    <div className={clsx(classes.root, focus && classes.focus)}>
      <Editor
        init={{
          height: 300,
          menubar: false,
          plugins: ["lists link image", "paste help"],
          statusbar: false,
          toolbar:
            "formatselect | bold italic forecolor | link | bullist numlist outdent indent | removeformat | help",
          skin_url: "/static/js/skins/ui/oxide",
        }}
        value={value}
        onEditorChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  );
}
