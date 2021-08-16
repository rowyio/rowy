import { Theme, ThemeOptions } from "@material-ui/core/styles";
import { colord } from "colord";

export const components = (theme: Theme): ThemeOptions => {
  const colorDividerHalf = colord(theme.palette.divider)
    .alpha(colord(theme.palette.divider).alpha() / 2)
    .toHslString();

  return {
    components: {
      MuiContainer: {
        defaultProps: {
          maxWidth: "xl",
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "filled",
          size: "small",
        },
      },
      MuiInputBase: {
        styleOverrides: {
          inputSizeSmall: {
            ...theme.typography.body2,
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.input,
            "&:hover:not(.Mui-disabled), &:focus, &.Mui-focused": {
              backgroundColor: theme.palette.input,
            },

            boxShadow:
              theme.palette.mode === "dark"
                ? `0 0 0 1px ${colorDividerHalf} inset`
                : `0 0 0 1px ${theme.palette.divider} inset`,
            borderRadius: 4,

            overflow: "hidden",
            "&::before": {
              borderRadius: 4,
              height: 8,

              borderColor: theme.palette.text.disabled,
            },
            "&.Mui-focused::before, &.Mui-focused:hover::before": {
              borderColor: theme.palette.primary.main,
            },

            "&.Mui-disabled": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "transparent"
                  : theme.palette.action.disabledBackground,
            },
          },
          colorSecondary: {
            "&.Mui-focused::before, &.Mui-focused:hover::before": {
              borderColor: theme.palette.secondary.main,
            },
          },
          inputSizeSmall: {
            padding: "6px 12px",
            height: 20,
          },
          multiline: { padding: 0 },
        },
      },
      MuiInputLabel: {
        defaultProps: {
          shrink: true,
        },
        styleOverrides: {
          filled: {
            "&, &.MuiInputLabel-shrink": { transform: "none" },

            position: "static",
            padding: "2px 12px",
            pointerEvents: "auto",

            maxWidth: "none",
            overflow: "visible",
            whiteSpace: "normal",

            ...theme.typography.caption,
            fontWeight: 500,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            "& > *": {
              margin: 0,
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
          icon: {
            transition: "transform 0.2s",
          },
          iconOpen: {
            transform: "rotate(180deg)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 8,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 8,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          sizeSmall: {
            width: 36,
            height: 36,
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            left: "calc(env(safe-area-inset-left) + 8px)",
            bottom: "calc(env(safe-area-inset-bottom) + 8px)",
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },

      MuiListItem: {
        styleOverrides: {
          root: {
            width: "calc(100% - 16px)",
            margin: "4px 8px",
            padding: "4px 8px",
            borderRadius: 4,
          },
        },
        defaultProps: {
          dense: true,
        },
      },
      MuiMenu: {
        styleOverrides: {
          list: {
            padding: "4px 0",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            width: "calc(100% - 8px)",
            margin: "0 4px",
            padding: "6px 12px",
            minHeight: 32,
            borderRadius: 4,

            "&.Mui-selected": {
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
            },

            "& + .MuiDivider-root": {
              marginTop: theme.spacing(0.5),
              marginBottom: theme.spacing(0.5),
            },
          },
        },
        defaultProps: {
          dense: true,
        },
      },
      MuiListSubheader: {
        defaultProps: {
          disableSticky: true,
        },
        styleOverrides: {
          root: {
            ...theme.typography.subtitle2,
            color: theme.palette.text.primary,
            lineHeight: "32px",
            userSelect: "none",
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            ".Mui-selected &": {
              color: "inherit",
            },
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 32,
            paddingTop: 4,
            paddingBottom: 4,
          },
          sizeSmall: {
            minHeight: 28,
            paddingTop: 2,
            paddingBottom: 2,
          },
          sizeLarge: {
            minHeight: 48,
            fontSize: 16,
            borderRadius: 6,
          },

          outlined: {
            "&, &:hover, &.Mui-disabled": { border: "none" },
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 0 0 1px ${colorDividerHalf} inset,
                 0 1px 0 0 ${colorDividerHalf} inset`
                : `0 0 0 1px ${theme.palette.divider} inset,
                 0 -1px 0 0 ${theme.palette.divider} inset`,
            backgroundColor: theme.palette.input,

            "&.Mui-disabled": {
              boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
              backgroundColor: "transparent",
            },
          },
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          grouped: {
            minWidth: 32,
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          TouchRippleProps: { center: false },
        },
        styleOverrides: {
          sizeSmall: {
            borderRadius: 4,
          },
        },
      },

      MuiChip: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          sizeMedium: {
            height: "auto",
            minHeight: 32,
            padding: "4px 0",
            "&.MuiChip-outlined": { padding: "3px 0" },
          },
          sizeSmall: {
            // height: "auto",
            minHeight: 24,
            padding: "2px 0",
            "&.MuiChip-outlined": { padding: "1px 0" },
          },
        },
      },
      MuiSwitch: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          sizeMedium: {
            width: 42 + (38 - 24),
            height: 24 + (38 - 24),
            padding: (38 - 24) / 2,

            "& .MuiSwitch-thumb": {
              width: 16,
              height: 16,
            },
            "& .MuiSwitch-switchBase": { padding: 11 },
          },
          sizeSmall: {
            width: 36 + (28 - 20),
            height: 20 + (28 - 20),
            padding: (28 - 20) / 2,

            "& .MuiSwitch-thumb": {
              width: 12,
              height: 12,
            },
            "& .MuiSwitch-switchBase": { padding: 8 },
          },

          track: {
            borderRadius: 24 / 2,
            backgroundColor: "transparent",
            boxShadow: `0 0 0 1px ${theme.palette.text.disabled} inset`,
            ".Mui-disabled + &": {
              backgroundColor: theme.palette.text.disabled,
            },

            opacity: 1,
            ".MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) + &": {
              opacity: 1,
            },
            ".MuiSwitch-switchBase.Mui-checked + &": {
              boxShadow: "none",
            },
          },
          switchBase: {
            color: theme.palette.text.primary,
            "&.Mui-checked": { transform: "translateX(18px)" },
          },
          thumb: {
            borderRadius: 24 / 2,
            boxShadow: theme.shadows[1],

            background: theme.palette.text.secondary,
            ".MuiSwitch-switchBase.Mui-checked &": {
              backgroundColor: theme.palette.secondary.contrastText,
            },

            transition: theme.transitions.create(
              ["width", "transform", "background-color"],
              { duration: theme.transitions.duration.shortest }
            ),

            ".MuiSwitch-root:hover &": {
              transform: `scale(${1 + 2 / 16})`,
            },
            ".MuiSwitch-root.MuiSwitch-sizeSmall:hover &": {
              transform: `scale(${1 + 2 / 12})`,
            },

            ".MuiSwitch-root:active .MuiSwitch-switchBase:not(.Mui-disabled) &": {
              width: 16 + 4,
            },
            ".MuiSwitch-root.MuiSwitch-sizeSmall:active .MuiSwitch-switchBase:not(.Mui-disabled) &": {
              width: 12 + 4,
            },
            "& + .MuiTouchRipple-root": {
              borderRadius: 24 / 2,
              zIndex: -1,
            },

            ".MuiSwitch-root:active .MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) &": {
              transform: `translateX(-4px) scale(${1 + 2 / 16})`,
              "& + .MuiTouchRipple-root": { left: -4 },
            },
            ".MuiSwitch-root.MuiSwitch-sizeSmall:active .MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) &": {
              transform: `translateX(-4px) scale(${1 + 2 / 12})`,
            },

            ".MuiSwitch-switchBase.Mui-disabled &": {
              opacity: theme.palette.action.disabledOpacity,
            },
            ".MuiSwitch-switchBase.Mui-disabled.Mui-checked &": {
              opacity: 1,
            },
          },

          colorSuccess: {
            "&.Mui-checked": {
              color: theme.palette.success.light,
              "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.success.light,
              },
            },
          },
        } as any,
      },
      MuiSlider: {
        styleOverrides: {
          thumb: {
            color: theme.palette.common.white,
            transformOrigin: "50% 50%",

            "&::before": {
              boxShadow:
                theme.palette.mode === "dark"
                  ? theme.shadows[1].replace(")", ", 0.24)")
                  : `${theme.shadows[1]}, 0 0 0 1px ${theme.palette.divider}`,
            },

            "&:hover": {
              "& > input": {
                transform: `scale(${1 + 2 / 20})`,
                // transformOrigin: "50% 50%",
              },
            },
          },
        },
      },
    },
  };
};
