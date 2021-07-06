import _clone from "lodash/clone";
import _merge from "lodash/merge";
import _omit from "lodash/omit";
import _mapValues from "lodash/mapValues";

import {
  createMuiTheme,
  Theme,
  ThemeOptions,
  fade,
} from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";

import antlerPalette from "./Theme/antlerPalette";

export const HEADING_FONT = "Europa, sans-serif";
export const BODY_FONT = '"Open Sans", sans-serif';
export const MONO_FONT =
  "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace";
export const LOG_FONT = "IBM Plex Mono, monospace";

export const ANTLER_RED = "#ED4747";
export const SECONDARY_GREY = "#282829";
export const SECONDARY_TEXT = "rgba(0, 0, 0, 0.6)";
export const LOG_TEXT = "#cccccc";
export const ERROR = "#b00020";

export const ROOT_FONT_SIZE = 16;
export const toRem = (px: number) => `${px / ROOT_FONT_SIZE}rem`;
export const toEm = (px: number, root: number) => `${px / root}em`;

declare module "@material-ui/core/styles/createPalette" {
  interface TypeBackground {
    elevation?: Record<0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24, string>;
  }
}
declare module "@material-ui/core/styles/createTypography" {
  interface FontStyle {
    fontFamilyMono: string;
  }
}
declare module "@material-ui/core/styles/transitions" {
  interface Easing {
    custom: string;
  }
}

export const themeBase = {
  palette: {
    primary: { main: ANTLER_RED, light: ANTLER_RED },
    secondary: { main: SECONDARY_GREY },
    text: { secondary: SECONDARY_TEXT, log: LOG_TEXT },
    error: { main: ERROR },
  },
  typography: {
    fontFamily: BODY_FONT,
    fontFamilyMono: MONO_FONT,
    h1: { fontFamily: HEADING_FONT },
    h2: { fontFamily: HEADING_FONT },
    h3: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(36),
      fontWeight: "bold",
    },
    h4: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(32),
      fontWeight: "bold",
    },
    h5: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(24),
      fontWeight: "bold",
    },
    h6: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(18),
      fontWeight: "bold",
      lineHeight: "normal",
    },
    subtitle1: {
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(14),
      fontWeight: "bold",
      letterSpacing: toEm(0.4, 14),
      lineHeight: 1.5,
    },
    body1: {
      letterSpacing: toEm(0.5, 16),
      lineHeight: 1.75,
    },
    body2: {
      fontSize: toRem(14),
      letterSpacing: toEm(0.25, 14),
    },
    button: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(16),
      fontWeight: "bold",
      letterSpacing: toEm(0.75, 16),
      lineHeight: 1,
    },
    caption: {
      fontSize: toRem(14),
      letterSpacing: toEm(0.4, 14),
      lineHeight: 20 / 14,
    },
    overline: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(13),
      fontWeight: "bold",
      letterSpacing: toEm(2, 13),
      lineHeight: 16 / 13,
      color: SECONDARY_TEXT,
    },
  },
};

export const darkThemeBase = {
  // https://material.io/design/color/dark-theme.html#ui-application
  palette: {
    type: "dark",
    background: {
      default: "#121212",
      paper: "#1E1E1E",
      elevation: {
        0: "#121212",
        1: "#1E1E1E",
        2: "#222222",
        3: "#252525",
        4: "#272727",
        6: "#2C2C2C",
        8: "#2E2E2E",
        12: "#333333",
        16: "#363636",
        24: "#383838",
      },
    },
    secondary: { main: "#E4E4E5" },
    text: {
      // primary: "rgba(255, 255, 255, 0.87)",
      secondary: "rgba(255, 255, 255, 0.7)",
      log: "black",
      // disabled: "rgba(255, 255, 255, 0.38)",
    },
    error: { main: "#CF6679" },
  },
  typography: {
    overline: { color: "rgba(255, 255, 255, 0.6)" },
  },
  overrides: {
    MuiBackdrop: {
      root: { backgroundColor: "rgba(0, 0, 0, 0.67)" },
    },
  },
};

export const defaultOverrides = (theme: Theme): ThemeOptions => ({
  transitions: {
    easing: { custom: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
  },
  overrides: {
    MuiContainer: {
      root: {
        "@supports (padding: max(0px))": {
          paddingLeft: `max(${theme.spacing(2)}px, env(safe-area-inset-left))`,
          paddingRight: `max(${theme.spacing(
            2
          )}px, env(safe-area-inset-right))`,

          "@media (min-width: 640px)": {
            paddingLeft: `max(${theme.spacing(
              3
            )}px, env(safe-area-inset-left))`,
            paddingRight: `max(${theme.spacing(
              3
            )}px, env(safe-area-inset-right))`,
          },
        },
      },
    },
    MuiTooltip: {
      tooltip: theme.typography.caption,
    },
    MuiButton: {
      root: {
        minHeight: 32,
        padding: theme.spacing(0.25, 2),
      },
      sizeSmall: { minHeight: 30 },
      sizeLarge: { minHeight: 48 },

      contained: {
        borderRadius: 500,
        boxShadow: "none",
      },
      containedSizeLarge: { padding: theme.spacing(1, 4) },

      outlined: { padding: theme.spacing(3 / 8, 15 / 8) },
      outlinedPrimary: {
        // Same as outlined text field
        borderColor: fade(theme.palette.divider, 0.23),
      },
      outlinedSizeLarge: {
        padding: theme.spacing(1, 4),
        borderRadius: 500,

        "&$outlinedPrimary": { borderColor: theme.palette.primary.main },
      },

      iconSizeMedium: {
        "& > *:first-child": { fontSize: 24 },
      },
    },
    MuiSvgIcon: {
      fontSizeLarge: { fontSize: toRem(36) },
    },
    // Override text field label
    MuiFormLabel: {
      root: {
        ...theme.typography.subtitle2,
        lineHeight: 1,
      },
    },
    // Override radio & checkbox labels
    MuiFormControlLabel: {
      root: { display: "flex" },
      label: theme.typography.body1,
    },
    MuiChip: {
      root: {
        borderRadius: 4,
        maxWidth: "100%",

        height: "auto",
        minHeight: 32,

        color: theme.palette.text.secondary,
      },
      label: {
        ...theme.typography.caption,
        color: "inherit",
        padding: theme.spacing(1, 1.5),
        // whiteSpace: "normal",

        "$outlined &": {
          paddingTop: theme.spacing(0.875),
          paddingBottom: theme.spacing(0.875),
        },
      },
      sizeSmall: { minHeight: 24 },
      labelSmall: {
        padding: theme.spacing(0.5, 1.5),
      },

      outlined: {
        backgroundColor: theme.palette.action.selected,
        borderColor: theme.palette.action.selected,
      },
      outlinedPrimary: {
        backgroundColor: fade(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },

      deleteIcon: { color: "inherit" },
    },
    MuiBadge: {
      badge: {
        ...theme.typography.caption,
        fontFeatureSettings: '"tnum"',
      },
    },
    MuiPaper: {
      root: {
        backgroundColor: "var(--bg-paper)",
        "--bg-paper": theme.palette.background.paper,
      },
      rounded: { borderRadius: 8 },
      // Dark theme paper elevation backgrounds
      ...(() => {
        const classes: Record<string, any> = {};
        for (let i = 0; i <= 24; i++) {
          if (theme.palette.background.elevation === undefined) continue;

          let closestElevation = i;
          for (let j = i; j > 0; j--) {
            if (theme.palette.background.elevation[j] !== undefined) {
              closestElevation = j;
              break;
            }
          }

          classes["elevation" + i] = {
            "&&": {
              "--bg-paper":
                theme.palette.background.elevation[closestElevation],
            },
          };
        }
        return classes;
      })(),
    },
    MuiSlider: {
      disabled: {},
      rail: {
        backgroundColor: "#e7e7e7",
        opacity: 1,
      },

      mark: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        marginLeft: -2,
        marginTop: -1,
        backgroundColor: "#69696a",
        "$disabled &": { backgroundColor: "currentColor" },
      },
      markActive: {
        opacity: 1,
        backgroundColor: "currentColor",
        "$disabled &": { backgroundColor: "currentColor" },
      },

      thumb: {
        width: 16,
        height: 16,
        marginTop: -7,
        marginLeft: -8,

        "$disabled &": {
          width: 12,
          height: 12,
          marginTop: -5,
          marginLeft: -6,
        },
      },

      valueLabel: {
        top: -22,
        left: "calc(-25%)",
        ...theme.typography.caption,
        color: theme.palette.primary.main,

        "& > *": {
          width: "auto",
          minWidth: 24,
          height: 24,

          whiteSpace: "nowrap",
          borderRadius: 500,

          padding: theme.spacing(0, 1),
          paddingRight: theme.spacing(0.875),
        },
        "& *": { transform: "none" },
      },
      markLabel: theme.typography.caption,
    },
    MuiFormHelperText: {
      contained: {
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(1.5),
      },
    },
    MuiListItemIcon: {
      root: { minWidth: theme.spacing(40 / 8) },
    },

    MuiSnackbar: {
      root: {
        ..._omit(theme.typography.overline, ["color"]),

        "&& > *": {
          ..._mapValues(
            _omit(theme.typography.overline, ["color"]),
            () => "inherit"
          ),
          alignItems: "center",
        },
      },
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: antlerPalette.aGray[700],
        color: theme.palette.common.white,
        userSelect: "none",

        padding: theme.spacing(0.5, 2),
        boxShadow: "none",
      },

      message: {
        padding: theme.spacing(1, 2),
      },
    },
  },
  props: {
    MuiTypography: {
      variantMapping: {
        subtitle1: "div",
        subtitle2: "div",
      },
    },
    MuiRadio: { color: "primary" },
    MuiCheckbox: { color: "primary" },
    MuiButton: { color: "primary" },
    MuiTabs: {
      indicatorColor: "primary",
      textColor: "primary",
    },
    MuiCircularProgress: { size: 44 },
    // Select: show dropdown below text field to follow new Material spec
    MuiSelect: {
      MenuProps: {
        getContentAnchorEl: null,
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
        transformOrigin: { vertical: "top", horizontal: "center" },
      },
    },
    MuiLink: {
      color: "primary",
      underline: "hover",
    },
    MuiChip: { deleteIcon: <ClearIcon /> },
    MuiTextField: { variant: "filled" },
    MuiDialog: {
      PaperProps: { elevation: 4 },
    },
  },
});

export const customizableLightTheme = (customization: ThemeOptions) => {
  const customizedLightThemeBase = createMuiTheme(
    _merge({}, themeBase, customization)
  );

  return createMuiTheme(
    customizedLightThemeBase,
    _merge({}, defaultOverrides(customizedLightThemeBase), customization)
  );
};

export const customizableDarkTheme = (customization: ThemeOptions) => {
  const customizedDarkThemeBase = createMuiTheme(
    _merge({}, themeBase, darkThemeBase, customization)
  );

  return createMuiTheme(
    customizedDarkThemeBase,
    _merge({}, defaultOverrides(customizedDarkThemeBase), customization)
  );
};

const Themes = {
  light: customizableLightTheme,
  dark: customizableDarkTheme,
};
export default Themes;
