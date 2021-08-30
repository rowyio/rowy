import { Theme, ThemeOptions } from "@material-ui/core/styles";

import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
extend([mixPlugin]);

declare module "@material-ui/core/styles/createTransitions" {
  interface Easing {
    strong: string;
  }
}

export const components = (theme: Theme): ThemeOptions => {
  const colorDividerHalf = colord(theme.palette.divider)
    .alpha(colord(theme.palette.divider).alpha() / 2)
    .toHslString();

  const buttonPrimaryHover = colord(theme.palette.primary.main)
    .mix(theme.palette.primary.contrastText, 0.12)
    .alpha(1)
    .toHslString();
  const buttonSecondaryHover = colord(theme.palette.secondary.main)
    .mix(theme.palette.secondary.contrastText, 0.12)
    .alpha(1)
    .toHslString();

  const fabBackgroundColor =
    theme.palette.mode === "dark"
      ? colord(theme.palette.background.default)
          .mix(theme.palette.action.selected, 0.24)
          .alpha(1)
          .toHslString()
      : theme.palette.background.paper;

  const transitionEasingStrong = "cubic-bezier(0.85, 0, 0, 1)"; // https://docs.microsoft.com/en-us/windows/apps/design/signature-experiences/motion#animation-properties

  return {
    transitions: {
      easing: { strong: transitionEasingStrong },
    },
    components: {
      MuiContainer: {
        defaultProps: { maxWidth: "xl" },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: (theme.shape.borderRadius as number) * 2 },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: (theme.shape.borderRadius as number) * 2,

            "--dialog-spacing": theme.spacing(3),
            [theme.breakpoints.down("sm")]: {
              "--dialog-spacing": theme.spacing(2),
            },
            padding: "0 var(--dialog-spacing)",
          },

          paperWidthXs: { maxWidth: 360 },
          paperFullScreen: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            marginTop: theme.spacing(1),
            maxHeight: `calc(100% - ${theme.spacing(1)})`,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            padding: `calc(var(--dialog-spacing) - (28px - 16px) / 2) 0`,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            margin: "0 calc(var(--dialog-spacing) * -1)",
            padding: theme.spacing(0, "var(--dialog-spacing)", 1),
            "&:last-child": { paddingBottom: "var(--dialog-spacing)" },

            "--dialog-contents-spacing": theme.spacing(3),
            "& > * + *": { marginTop: "var(--dialog-contents-spacing)" },

            ...theme.typography.body2,
          },
        },
      },
      MuiDialogContentText: {
        defaultProps: {
          variant: "body2",
          color: "textPrimary",
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            justifyContent: "center",
            "& .MuiButton-root": { minWidth: 100 },
          },
          spacing: {
            padding: theme.spacing(2, 0),
            [theme.breakpoints.down("sm")]: { padding: theme.spacing(1.5, 0) },
          },
        },
      },

      MuiSnackbar: {
        styleOverrides: {
          root: {
            left: `calc(env(safe-area-inset-left) + ${theme.spacing(1)})`,
            bottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(1)})`,
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            borderRadius: (theme.shape.borderRadius as number) * 2,
            backgroundColor: theme.palette.secondary.main,
          },
        },
      },

      MuiTypography: {
        defaultProps: { variant: "body2" },
      },

      MuiTextField: {
        defaultProps: {
          variant: "filled",
          size: "small",
        },
      },
      MuiInputBase: {
        styleOverrides: {
          inputSizeSmall: theme.typography.body2,
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.action.input,
            "&:hover:not(.Mui-disabled), &:focus, &.Mui-focused": {
              backgroundColor: theme.palette.action.input,
            },

            boxShadow: `0 0 0 1px ${
              theme.palette.mode === "dark"
                ? colorDividerHalf
                : theme.palette.divider
            } inset`,
            borderRadius: theme.shape.borderRadius,

            overflow: "hidden",
            "&::before": {
              borderRadius: theme.shape.borderRadius,
              height: (theme.shape.borderRadius as number) * 2,

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
      MuiFormHelperText: {
        styleOverrides: {
          filled: { margin: theme.spacing(0.5, 1.5, 0) },
        },
      },

      MuiSelect: {
        styleOverrides: {
          select: {
            // If Select option is a MenuItem, don’t add spacing
            "& > *": {
              margin: 0,
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
          icon: {
            transition: theme.transitions.create("transform", {
              duration: theme.transitions.duration.short,
            }),
          },
          iconOpen: { transform: "rotate(180deg)" },
        },
      },
      MuiListItem: {
        defaultProps: { dense: true },
      },
      MuiMenu: {
        styleOverrides: {
          list: { padding: theme.spacing(0.5, 0) },
        },
      },
      MuiMenuItem: {
        defaultProps: { dense: true },
        styleOverrides: {
          root: {
            width: `calc(100% - ${theme.spacing(1)})`,
            margin: theme.spacing(0, 0.5),
            padding: theme.spacing(0.5, 0.75, 0.5, 1.5),
            minHeight: 32,
            borderRadius: theme.shape.borderRadius,

            "&.Mui-selected": {
              backgroundColor: theme.palette.action.selected,
              "&::before": {
                content: "''",
                display: "block",
                position: "absolute",
                top: (32 - 16) / 2,
                left: 0,

                width: 3,
                height: 16,
                borderRadius: 1.5,
                backgroundColor: theme.palette.primary.main,
              },
            },

            "& .MuiListItemIcon-root": {
              minWidth: 24 + 12,
              "& svg": { fontSize: "1.5rem" },
            },

            "& + .MuiDivider-root": {
              marginTop: theme.spacing(0.5),
              marginBottom: theme.spacing(0.5),
            },
          },
        },
      },
      MuiListSubheader: {
        defaultProps: { disableSticky: true },
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
            ".Mui-selected &": { color: "inherit" },
          },
        },
      },
      MuiListItemSecondaryAction: {
        styleOverrides: {
          root: { right: theme.spacing(0.75) },
        },
      },

      MuiButton: {
        defaultProps: {
          variant: "outlined",
          color: "secondary",
        },
        styleOverrides: {
          root: {
            minHeight: 32,
            paddingTop: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.5),
            "&.MuiButton-outlined, &.MuiButton-contained": {
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
            },
            "& .MuiButton-iconSizeMedium > *:nth-of-type(1)": { fontSize: 24 },
          },
          sizeSmall: {
            minHeight: 24,
            paddingTop: theme.spacing(0.25),
            paddingBottom: theme.spacing(0.25),
            "&.MuiButton-outlined, &.MuiButton-contained": {
              paddingLeft: theme.spacing(10 / 8),
              paddingRight: theme.spacing(10 / 8),
            },
          },
          sizeLarge: {
            minHeight: 48,
            "&.MuiButton-outlined, &.MuiButton-contained": {
              paddingLeft: theme.spacing(22 / 8),
              paddingRight: theme.spacing(22 / 8),
            },
            fontSize: "1rem",
            borderRadius: (theme.shape.borderRadius as number) * (16 / 14),
            "& .MuiButton-iconSizeLarge > *:nth-of-type(1)": { fontSize: 24 },
          },

          outlined: {
            "&, &:hover, &.Mui-disabled": { border: "none" },
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 0 0 1px ${colorDividerHalf} inset,
                 0 1px 0 0 ${colorDividerHalf} inset`
                : `0 0 0 1px ${theme.palette.divider} inset,
                 0 -1px 0 0 ${theme.palette.divider} inset`,
            backgroundColor: theme.palette.action.input,

            "&.Mui-disabled": {
              boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
              backgroundColor: "transparent",
            },
          },
          outlinedPrimary: {
            "&:hover": {
              backgroundColor: colord(theme.palette.action.input)
                .mix(
                  theme.palette.primary.main,
                  theme.palette.action.hoverOpacity
                )
                .toHslString(),
            },
          },
          outlinedSecondary: {
            "&:hover": {
              backgroundColor: colord(theme.palette.action.input)
                .mix(
                  theme.palette.secondary.main,
                  theme.palette.action.hoverOpacity
                )
                .toHslString(),
            },
          },

          contained: {
            boxShadow: `${theme.shadows[2]}, 0 -1px 0 0 rgba(0, 0, 0, 0.12) inset`,
          },
          containedPrimary: {
            "&:hover": { backgroundColor: buttonPrimaryHover },
          },
          containedSecondary: {
            "&:hover": { backgroundColor: buttonSecondaryHover },
          },
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          grouped: { minWidth: 32 },
        },
      },

      MuiIconButton: {
        defaultProps: {
          TouchRippleProps: { center: false },
        },
        styleOverrides: {
          sizeSmall: { borderRadius: theme.shape.borderRadius },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            "&:not(.MuiFab-primary):not(.MuiFab-secondary):not(.Mui-disabled)": {
              backgroundColor: fabBackgroundColor,
              color: theme.palette.text.primary,

              "&:hover": {
                backgroundColor: colord(fabBackgroundColor)
                  .mix(
                    theme.palette.action.hover,
                    theme.palette.action.hoverOpacity
                  )
                  .alpha(1)
                  .toHslString(),
              },
            },

            "&.Mui-disabled": {
              backgroundColor: colord(theme.palette.background.default)
                .mix(
                  theme.palette.action.disabledBackground,
                  colord(theme.palette.action.disabledBackground).alpha()
                )
                .alpha(1)
                .toHslString(),
            },
          },
          primary: {
            boxShadow: `${theme.shadows[6]}, 0 -1px 0 0 rgba(0, 0, 0, 0.12) inset`,
            "&:hover": { backgroundColor: buttonPrimaryHover },
          },
          secondary: {
            boxShadow: `${theme.shadows[6]}, 0 -1px 0 0 rgba(0, 0, 0, 0.12) inset`,
            "&:hover": { backgroundColor: buttonSecondaryHover },
          },
          sizeSmall: { width: 36, height: 36 },
        },
      },

      MuiChip: {
        defaultProps: { size: "small" },
        styleOverrides: {
          sizeMedium: {
            height: "auto",
            minHeight: 32,
            padding: "4px 0",
            "&.MuiChip-outlined": { padding: "3px 0" },
          },
          sizeSmall: {
            height: "auto",
            minHeight: 24,
            padding: "2px 0",
            "&.MuiChip-outlined": { padding: "1px 0" },
          },

          clickable: {
            "&.MuiChip-filledPrimary:hover": {
              backgroundColor: buttonPrimaryHover,
            },
            "&.MuiChip-filledSecondary:hover": {
              backgroundColor: buttonSecondaryHover,
            },
          },
        },
      },

      MuiSwitch: {
        defaultProps: {
          size: "small",
          color: "success",
        },
        styleOverrides: {
          sizeMedium: {
            width: 56 + (38 - 32),
            height: 32 + (38 - 32),
            padding: (38 - 32) / 2,

            "& .MuiSwitch-thumb": { width: 22, height: 22 },
            "& .MuiSwitch-switchBase": { padding: 8 },
          },
          sizeSmall: {
            width: 36 + (28 - 20),
            height: 20 + (28 - 20),
            padding: (28 - 20) / 2,

            "& .MuiSwitch-thumb": { width: 12, height: 12 },
            "& .MuiSwitch-switchBase": { padding: 8 },
          },

          track: {
            borderRadius: 32 / 2,
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
            "&.Mui-checked": { transform: "translateX(24px)" },
          },
          thumb: {
            borderRadius: 22 / 2,
            boxShadow: theme.shadows[1],

            background: theme.palette.text.secondary,
            ".MuiSwitch-switchBase.Mui-checked &": {
              backgroundColor: theme.palette.secondary.contrastText,
            },

            transition: theme.transitions.create(
              ["width", "transform", "background-color"],
              { duration: theme.transitions.duration.shortest }
            ),

            ".MuiSwitch-root:hover .MuiSwitch-switchBase:not(.Mui-disabled) &": {
              transform: `scale(${1 + 2 / 22})`,
            },
            ".MuiSwitch-root.MuiSwitch-sizeSmall:hover .MuiSwitch-switchBase:not(.Mui-disabled) &": {
              transform: `scale(${1 + 2 / 12})`,
            },

            ".MuiSwitch-root:active .MuiSwitch-switchBase:not(.Mui-disabled) &": {
              width: 22 * 1.333,
            },
            ".MuiSwitch-root.MuiSwitch-sizeSmall:active .MuiSwitch-switchBase:not(.Mui-disabled) &": {
              width: 12 * 1.333,
            },
            "& + .MuiTouchRipple-root": {
              borderRadius: 22 / 2,
              zIndex: -1,
            },

            ".MuiSwitch-root:active .MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) &": {
              transform: `translateX(-${0.333 * 22}px) scale(${1 + 2 / 22})`,
              "& + .MuiTouchRipple-root": { left: -4 },
            },
            ".MuiSwitch-root.MuiSwitch-sizeSmall:active .MuiSwitch-switchBase.Mui-checked:not(.Mui-disabled) &": {
              transform: `translateX(-${0.333 * 12}px) scale(${1 + 2 / 12})`,
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
              "& > input": { transform: `scale(${1 + 2 / 20})` },
            },
          },

          mark: { width: 3, height: 3 },

          valueLabel: {
            borderRadius: theme.shape.borderRadius,

            "&::before": {
              borderRadius: (theme.shape.borderRadius as number) / 2,
              width: 10,
              height: 10,
              bottom: 1,
            },
          },
        },
      },

      MuiFormControlLabel: {
        defaultProps: {
          componentsProps: { typography: { variant: "body2" } },
        },
        styleOverrides: {
          root: {
            "& .MuiSwitch-root": { marginRight: theme.spacing(1) },
          },
          labelPlacementStart: {
            "& .MuiSwitch-root": { marginLeft: theme.spacing(1) },
          },
        },
      },

      MuiTabs: {
        defaultProps: {
          TabIndicatorProps: {
            children: <span className="MuiTabs-indicatorSpan" />,
          },
        },
        styleOverrides: {
          indicator: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",

            transitionTimingFunction: transitionEasingStrong,
            transitionDuration: `${theme.transitions.duration.complex}ms`,

            height: 3,
            ".MuiTabs-vertical &": { width: 3 },

            "& > .MuiTabs-indicatorSpan": {
              width: "100%",
              height: "100%",
              maxWidth: 32,
              maxHeight: 16,

              borderRadius: 1.5,
              backgroundColor: theme.palette.primary.main,

              transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
              }),
              ".MuiTabs-root:active &": { transform: "scaleX(1.25)" },
              ".MuiTabs-vertical:active &": { transform: "scaleY(1.25)" },
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            borderRadius: theme.shape.borderRadius,

            transition: theme.transitions.create(
              ["background-color", "color"],
              { duration: theme.transitions.duration.shortest }
            ),
            "&:hover": { backgroundColor: theme.palette.action.hover },
            "&.Mui-selected:hover": {
              backgroundColor: colord(theme.palette.primary.main)
                .alpha(theme.palette.action.hoverOpacity)
                .toHslString(),
            },
          },
        },
      },
    },
  };
};
