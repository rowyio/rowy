import { createTheme, ThemeOptions } from "@material-ui/core/styles";
import _merge from "lodash/merge";

import { typography, MONO_FONT } from "theme/typography";
import { colorsLight, colorsDark } from "theme/colors";
import { components } from "theme/components";

export { MONO_FONT };

declare module "@material-ui/core/styles/createTransitions" {
  interface Easing {
    custom: string;
  }
}

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
    _merge(
      {},
      typography((customization?.typography as any) ?? {}),
      colorsLight()
    )
  );

  return createTheme(
    _merge(
      {},
      customizedLightThemeBase,
      components(customizedLightThemeBase),
      customization
    )
  );
};

export const customizableDarkTheme = (customization: ThemeOptions) => {
  const customizedDarkThemeBase = createTheme(
    _merge(
      {},
      typography((customization?.typography as any) ?? {}),
      colorsDark()
    )
  );

  return createTheme(
    _merge(
      {},
      customizedDarkThemeBase,
      components(customizedDarkThemeBase),
      customization
    )
  );
};

const Themes = {
  light: customizableLightTheme,
  dark: customizableDarkTheme,
};
export default Themes;
