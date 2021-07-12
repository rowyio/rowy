import _merge from "lodash/merge";

import { createTheme, ThemeOptions } from "@material-ui/core/styles";

export const HEADING_FONT = "Space Grotesk, system-ui, sans-serif";
export const BODY_FONT = "Inter, system-ui, sans-serif";
export const MONO_FONT = "IBM Plex Mono, ui-monospace, monospace";

export const ANTLER_RED = "#ED4747";
export const SECONDARY_GREY = "#070042";
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
    fontFamilyHeading: string;
  }
}
declare module "@material-ui/core/styles/createTransitions" {
  interface Easing {
    custom: string;
  }
}

export const themeBase = {
  palette: {
    primary: { main: "#371FFF" },
    secondary: { main: SECONDARY_GREY },
    text: { secondary: SECONDARY_TEXT, log: LOG_TEXT },
    error: { main: ERROR },
    background: { default: "#F9F9FB" },
  },
  typography: {
    fontFamily: BODY_FONT,
    fontFamilyMono: MONO_FONT,
    fontFamilyHeading: HEADING_FONT,
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
      fontFamily: BODY_FONT,
      fontSize: toRem(14),
      fontWeight: 600,
      letterSpacing: toEm(0.75, 14),
    },
    caption: {
      fontSize: toRem(14),
      letterSpacing: toEm(0.4, 14),
      lineHeight: 20 / 14,
    },
    overline: {
      fontFamily: BODY_FONT,
      fontSize: toRem(13),
      fontWeight: "bold",
      letterSpacing: toEm(2, 13),
      lineHeight: 16 / 13,
      // color: SECONDARY_TEXT,
    },
  },
  shadows: [
    // Based on https://tailwindcss.com/docs/box-shadow
    // with additional “outline” shadow
    "none", // 0
    "0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", // 1
    "0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", // 2
    "0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", // 3
    "0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // 4
    "0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // 5
    "0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // 6
    "0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // 7
    "0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // 8
    "0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // 9
    "0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // 10
    "0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // 11
    "0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // 12
    "0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // 13
    "0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // 14
    "0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // 15
    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // 16
    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // 17
    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // 18
    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // 19
    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // 20
    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // 21
    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // 22
    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // 23
    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 25px 50px -12px rgba(0, 0, 0, 0.25)", // 24
  ],
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "filled",
        // size: "small",
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
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
          borderRadius: 4,
          "&.Mui-selected": {
            color: "#371FFF",
          },
        },
      },
    },
  },
};

export const darkThemeBase = {
  // https://material.io/design/color/dark-theme.html#ui-application
  palette: {
    mode: "dark",
    primary: { main: "#8A99FF" },
    secondary: { main: "#E4E4E5" },
    text: {
      // primary: "rgba(255, 255, 255, 0.87)",
      secondary: "rgba(255, 255, 255, 0.7)",
      log: "black",
      // disabled: "rgba(255, 255, 255, 0.38)",
    },
    error: { main: "#CF6679" },
    background: { default: "#121212" },
  },
  // typography: {
  //   overline: { color: "rgba(255, 255, 255, 0.6)" },
  // },
};

// TODO: export const defaultOverrides = (): ThemeOptions => ({
//   transitions: {
//     easing: { custom: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
//   },
//   overrides: {
//     MuiContainer: {
//       root: {
//         "@supports (padding: max(0px))": {
//           paddingLeft: `max(${theme.spacing(2)}, env(safe-area-inset-left))`,
//           paddingRight: `max(${theme.spacing(
//             2
//           )}px, env(safe-area-inset-right))`,

//           "@media (min-width: 640px)": {
//             paddingLeft: `max(${theme.spacing(
//               3
//             )}px, env(safe-area-inset-left))`,
//             paddingRight: `max(${theme.spacing(
//               3
//             )}px, env(safe-area-inset-right))`,
//           },
//         },
//       },
//     },
//     MuiTooltip: {
//       tooltip: {
//         ...theme.typography.caption,
//         fontWeight: theme.typography.fontWeightMedium,
//       },
//     },
//     MuiButton: {
//       root: {
//         minHeight: 32,
//         padding: theme.spacing(0.25, 2),
//       },
//       sizeSmall: { minHeight: 30 },
//       sizeLarge: { minHeight: 48 },

//       contained: {
//         borderRadius: 500,
//         boxShadow: "none",
//       },
//       containedSizeLarge: { padding: theme.spacing(1, 4) },

//       outlined: { padding: theme.spacing(3 / 8, 15 / 8) },
//       outlinedPrimary: {
//         // Same as outlined text field
//         borderColor: alpha(theme.palette.divider, 0.23),
//       },
//       outlinedSizeLarge: {
//         padding: theme.spacing(1, 4),
//         borderRadius: 500,

//         "&$outlinedPrimary": { borderColor: theme.palette.primary.main },
//       },

//       iconSizeMedium: {
//         "& > *:first-child": { fontSize: 24 },
//       },
//     },
//     MuiSvgIcon: {
//       fontSizeLarge: { fontSize: toRem(36) },
//     },
//     // Override text field label
//     MuiFormLabel: {
//       root: {
//         fontWeight: theme.typography.fontWeightMedium,
//         // lineHeight: 1,
//       },
//     },
//     // Override radio & checkbox labels
//     MuiFormControlLabel: {
//       root: { display: "flex" },
//       label: theme.typography.body1,
//     },
//     MuiChip: {
//       root: {
//         // borderRadius: theme.shape.borderRadius,
//         maxWidth: "100%",

//         height: "auto",
//         minHeight: 32,
//       },
//       label: {
//         ...theme.typography.caption,
//         color: "inherit",
//         padding: theme.spacing(0.75, 1.5),

//         "$outlined &": {
//           paddingTop: theme.spacing(0.75) - 1,
//           paddingBottom: theme.spacing(0.75) - 1,
//         },
//       },
//       sizeSmall: { minHeight: 24 },
//       labelSmall: { padding: theme.spacing(0.5, 1.5) },

//       deleteIcon: { color: "inherit" },
//     },
//     // MuiPaper: {
//     // root: {
//     //   backgroundColor: "var(--bg-paper)",
//     //   "--bg-paper": theme.palette.background.paper,
//     // },
//     // rounded: { borderRadius: (theme.shape.borderRadius as number) * 2 },
//     // Dark theme paper elevation backgrounds
//     // ...(() => {
//     //   const classes: Record<string, any> = {};
//     //   for (let i = 0; i <= 24; i++) {
//     //     if (theme.palette.background.elevation === undefined) continue;

//     //     let closestElevation = i;
//     //     for (let j = i; j > 0; j--) {
//     //       if (theme.palette.background.elevation[j] !== undefined) {
//     //         closestElevation = j;
//     //         break;
//     //       }
//     //     }

//     //     classes["elevation" + i] = {
//     //       "&&": {
//     //         "--bg-paper":
//     //           theme.palette.background.elevation[closestElevation],
//     //       },
//     //     };
//     //   }
//     //   return classes;
//     // })(),
//     // },
//     MuiSlider: {
//       mark: {
//         width: 4,
//         height: 4,
//         borderRadius: "50%",
//         marginLeft: -2,
//         marginTop: -1,
//         // backgroundColor: "#69696a",
//         "$disabled &": { backgroundColor: "currentColor" },
//       },
//       markActive: {
//         opacity: 1,
//         backgroundColor: "currentColor",
//         "$disabled &": { backgroundColor: "currentColor" },
//       },
//       thumb: {
//         width: 16,
//         height: 16,
//         marginTop: -7,
//         marginLeft: -8,
//         "$disabled &": {
//           width: 12,
//           height: 12,
//           marginTop: -5,
//           marginLeft: -6,
//         },
//       },
//       valueLabel: {
//         "& *": { transform: "none" },

//         top: -22,
//         left: "auto",
//         right: "auto",
//         color: "inherit",

//         "& > *": {
//           width: "auto",
//           minWidth: 24,
//           height: 24,
//           borderRadius: 500,

//           paddingLeft: 6,
//           paddingRight: `calc(6px - ${theme.typography.caption.letterSpacing})`,

//           ...theme.typography.caption,
//           whiteSpace: "nowrap",
//         },
//       },

//       markLabel: theme.typography.caption,
//     },
//     MuiFormHelperText: {
//       contained: {
//         marginLeft: theme.spacing(1.5),
//         marginRight: theme.spacing(1.5),
//       },
//     },
//     MuiListItemIcon: {
//       root: { minWidth: theme.spacing(40 / 8) },
//     },
//   },
//   props: {
//     MuiTypography: {
//       variantMapping: {
//         subtitle1: "div",
//         subtitle2: "div",
//       },
//     },
//     MuiRadio: { color: "primary" },
//     MuiCheckbox: { color: "primary" },
//     MuiButton: { color: "primary" },
//     MuiTabs: {
//       indicatorColor: "primary",
//       textColor: "primary",
//     },
//     MuiCircularProgress: { size: 44 },
//     // Select: show dropdown below text field to follow new Material spec
//     MuiSelect: {
//       MenuProps: {
//         anchorOrigin: { vertical: "bottom", horizontal: "center" },
//         transformOrigin: { vertical: "top", horizontal: "center" },
//       },
//     },
//     MuiLink: {
//       color: "primary",
//       underline: "hover",
//     },
//     MuiChip: { deleteIcon: <ClearIcon /> },
//     MuiTextField: { variant: "filled" },
//     MuiDialog: {
//       PaperProps: { elevation: 4 },
//     },
//   },
// });

export const customizableLightTheme = (customization: ThemeOptions) => {
  const customizedLightThemeBase = createTheme(
    _merge({}, themeBase, customization)
  );

  return createTheme(
    customizedLightThemeBase,
    // _merge({}, defaultOverrides(customizedLightThemeBase),
    customization
    // )
  );
};

export const customizableDarkTheme = (customization: ThemeOptions) => {
  const customizedDarkThemeBase = createTheme(
    _merge({}, themeBase, darkThemeBase, customization)
  );

  return createTheme(
    customizedDarkThemeBase,
    // _merge({}, defaultOverrides(customizedDarkThemeBase),
    customization
    // )
  );
};

const Themes = {
  light: customizableLightTheme,
  dark: customizableDarkTheme,
};
export default Themes;
