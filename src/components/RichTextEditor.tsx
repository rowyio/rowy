import { useState } from "react";
import clsx from "clsx";

import { Editor } from "@tinymce/tinymce-react";

// TinyMCE so the global var exists
import "tinymce/tinymce.min.js";
// Theme
import "tinymce/themes/silver";
// Toolbar icons
import "tinymce/icons/default";
// Editor styles
import "tinymce/skins/ui/oxide/skin.min.css";
// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
import contentCss from "!!raw-loader!tinymce/skins/content/default/content.min.css";
import contentUiCss from "!!raw-loader!tinymce/skins/ui/oxide/content.min.css";
import contentCssDark from "!!raw-loader!tinymce/skins/content/dark/content.min.css";
import contentUiCssDark from "!!raw-loader!tinymce/skins/ui/oxide-dark/content.min.css";

// Plugins
import "tinymce/plugins/autoresize";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/paste";
import "tinymce/plugins/help";
import "tinymce/plugins/code";

import { makeStyles, createStyles } from "@mui/styles";
import { useTheme } from "@mui/material";
const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      body: {
        fontFamily: theme.typography.fontFamily + " !important",
      },
    },

    root: {
      "& .tox": {
        "&.tox-tinymce": {
          borderRadius: theme.shape.borderRadius,
          border: "none",

          backgroundColor: theme.palette.action.input,
          boxShadow: `0 -1px 0 0 ${theme.palette.text.disabled} inset,
                      0 0 0 1px ${theme.palette.action.inputOutline} inset`,
          transition: theme.transitions.create("box-shadow", {
            duration: theme.transitions.duration.short,
          }),

          "&:hover": {
            boxShadow: `0 -1px 0 0 ${theme.palette.text.primary} inset,
                        0 0 0 1px ${theme.palette.action.inputOutline} inset`,
          },
        },

        "& .tox-toolbar-overlord, & .tox-edit-area__iframe, & .tox-toolbar__primary":
          {
            background: "transparent",
            borderRadius: theme.shape.borderRadius,
          },
        "& .tox-edit-area__iframe": { colorScheme: "auto" },

        "& .tox-toolbar__group": { border: "none !important" },

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
      "& .tox.tox-tinymce, & .tox.tox-tinymce:hover": {
        boxShadow: `0 -2px 0 0 ${theme.palette.primary.main} inset,
                    0 0 0 1px ${theme.palette.action.inputOutline} inset`,
      },
    },

    disabled: {
      "& .tox.tox-tinymce, & .tox.tox-tinymce:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "transparent"
            : theme.palette.action.disabledBackground,
      },
    },
  })
);

export interface IRichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
}

export default function RichTextEditor({
  value,
  onChange,
  disabled,
  id,
}: IRichTextEditorProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={clsx(
        classes.root,
        focus && classes.focus,
        disabled && classes.disabled
      )}
    >
      <Editor
        disabled={disabled}
        init={{
          skin: false,
          content_css: false,
          content_style: [
            theme.palette.mode === "dark" ? contentCssDark : contentCss,
            theme.palette.mode === "dark" ? contentUiCssDark : contentUiCss,
            `
              :root {
                font-size: 14px;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }

              html, body { background-color: transparent; }
              body {
                font-family: ${theme.typography.fontFamily};
                color: ${theme.palette.text.primary};
                caret-color: ${theme.palette.primary.main};
                margin: ${theme.spacing(12 / 8)};
                margin-top: ${theme.spacing(1)};
                padding: 0 !important;
              }
              body :first-child { margin-top: 0; }
              a { color: ${theme.palette.primary.main}; }
            `,
          ].join("\n"),
          minHeight: 300,
          menubar: false,
          plugins: ["autoresize", "lists link image", "paste help", "code"],
          statusbar: false,
          toolbar:
            "formatselect | bold italic forecolor | link | bullist numlist outdent indent | removeformat code | help",
          body_id: id,
        }}
        value={value}
        onEditorChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  );
}
