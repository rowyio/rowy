import { useState } from "react";
import { GlobalStyles } from "tss-react";
import { alpha, styled, useTheme } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";

// TinyMCE so the global var exists
import "tinymce/tinymce.min.js";
// Theme
import "tinymce/themes/silver";
// Toolbar icons
import "tinymce/icons/default";
// Editor styles
/* eslint import/no-webpack-loader-syntax: off */
import skinCss from "!!raw-loader!tinymce/skins/ui/oxide/skin.min.css";
import skinDarkCss from "!!raw-loader!tinymce/skins/ui/oxide-dark/skin.min.css";
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
import "tinymce/plugins/fullscreen";

const Styles = styled("div", {
  shouldForwardProp: (prop) => prop !== "focus",
})<{ focus?: boolean; disabled?: boolean }>(({ theme, focus, disabled }) => ({
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

    "& .tox-toolbar__group": {
      border: "none !important",
      "& .tox-tbtn": {
        "&:hover:": {
          backgroundColor: "inherit",
        },
        "&:focus": {
          backgroundColor: "inherit",
        },
      },
      "& .tox-tbtn__select-chevron": {
        transition: theme.transitions.create("transform", {
          duration: theme.transitions.duration.short,
        }),
      },
      "& .tox-tbtn--select": {
        "& .tox-tbtn__select-chevron": {
          transform: "none",
        },
      },
      "& .tox-tbtn--active": {
        "& .tox-tbtn__select-chevron": {
          transform: "rotate(180deg)",
        },
      },
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

    "& .tox.tox-tinymce, & .tox.tox-tinymce:hover": disabled
      ? {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "transparent"
              : theme.palette.action.disabledBackground,
        }
      : focus
      ? {
          boxShadow: `0 -2px 0 0 ${theme.palette.primary.main} inset,
                  0 0 0 1px ${theme.palette.action.inputOutline} inset`,
        }
      : {},
  },
  ".tox.tox-tinymce.tox-fullscreen": {
    zIndex: 1203,
    backgroundColor: "hsl(240, 9%, 7%)",
  },
}));

export interface IRichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function RichTextEditor({
  value,
  onChange,
  disabled,
  id,
  onFocus,
  onBlur,
}: IRichTextEditorProps) {
  const theme = useTheme();
  const [focus, setFocus] = useState(false);

  return (
    <Styles focus={focus} disabled={disabled}>
      <style>{theme.palette.mode === "dark" ? skinDarkCss : skinCss}</style>
      <GlobalStyles
        styles={{
          ".tox": {
            // "& .tox-editor-container": {
            //   backgroundColor: theme.palette.background.paper,
            // },
            "& .tox-menu.tox-menu, &.tox-tinymce-aux .tox-toolbar__overflow.tox-toolbar__overflow":
              {
                backgroundColor: theme.palette.background.paper,
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))", // elevation 8
                boxShadow: theme.shadows[8],
                border: "none",
                borderRadius: (theme.shape.borderRadius as number) * 2,
              },

            "& .tox-collection--list": {
              "& .tox-collection__group.tox-collection__group": {
                padding: theme.spacing(0.5),
                paddingLeft: 0,
                paddingRight: 0,
              },
              "& .tox-collection__item": {
                padding: theme.spacing(0.5),
                marginLeft: theme.spacing(0.5),
                marginRight: theme.spacing(0.5),
                borderRadius: theme.shape.borderRadius,
              },

              "& .tox-collection__item--enabled": {
                backgroundColor: theme.palette.action.hover + " !important",
                position: "relative",
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: theme.spacing(1),
                  bottom: theme.spacing(1),
                  left: 0,
                  width: theme.spacing(0.3),
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: theme.palette.primary.main,
                },
              },

              "& .tox-collection__item--active": {
                backgroundColor:
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                  ) + "!important",
              },
              "& .tox-collection__item-checkmark": {
                display: "none",
              },
            },

            "&.tox-tinymce-aux .tox-toolbar__overflow.tox-toolbar__overflow": {
              padding: theme.spacing(0.5, 0),
            },
            "& .tox-tbtn.tox-tbtn": {
              borderRadius: theme.shape.borderRadius,
              margin: 0,
            },
          },
        }}
      />

      <Editor
        key={theme.palette.mode}
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
          plugins: [
            "fullscreen",
            "autoresize",
            "lists link image",
            "paste help",
            "code",
          ],
          statusbar: false,
          toolbar:
            "formatselect | bold italic forecolor | link | fullscreen | bullist numlist outdent indent | removeformat code | help",
          body_id: id,
        }}
        value={value}
        onEditorChange={onChange}
        onFocus={() => {
          setFocus(true);
          if (onFocus) onFocus();
        }}
        onBlur={() => {
          setFocus(false);
          if (onBlur) onBlur();
        }}
      />
    </Styles>
  );
}
