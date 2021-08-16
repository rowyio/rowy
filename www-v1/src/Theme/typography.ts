import { ThemeOptions } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createTypography" {
  interface FontStyle {
    fontFamilyMono: string;
    fontFamilyHeading: string;
  }
}

export const HEADING_FONT = "Space Grotesk, system-ui, sans-serif";
export const BODY_FONT = "Inter, system-ui, sans-serif";
export const MONO_FONT = "IBM Plex Mono, ui-monospace, monospace";

export const ROOT_FONT_SIZE = 16;
export const toRem = (px: number) => `${px / ROOT_FONT_SIZE}rem`;
export const toEm = (px: number, root: number) => `${px / root}em`;

export const typography = (): ThemeOptions => ({
  typography: {
    fontFamily: BODY_FONT,
    fontFamilyMono: MONO_FONT,
    fontFamilyHeading: HEADING_FONT,

    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,

    h1: {
      fontFamily: HEADING_FONT,
      fontWeight: 600,
      fontSize: toRem(96),
      letterSpacing: toEm(-1.5, 96),
      lineHeight: 112 / 96,
    },
    h2: {
      fontFamily: HEADING_FONT,
      fontWeight: 600,
      fontSize: toRem(60),
      letterSpacing: toEm(-0.75, 60),
      lineHeight: 72 / 60,
    },
    h3: {
      fontFamily: HEADING_FONT,
      fontWeight: 600,
      fontSize: toRem(48),
      letterSpacing: toEm(-0.5, 48),
      lineHeight: 60 / 48,
    },
    h4: {
      fontFamily: HEADING_FONT,
      fontWeight: 600,
      fontSize: toRem(34),
      letterSpacing: toEm(-0.35, 34),
      lineHeight: 44 / 34,
    },
    h5: {
      fontFamily: HEADING_FONT,
      fontWeight: 600,
      fontSize: toRem(24),
      // letterSpacing: toEm(-0.2, 24),
      lineHeight: 32 / 24,
    },
    h6: {
      fontFamily: HEADING_FONT,
      fontWeight: 600,
      fontSize: toRem(20),
      // letterSpacing: toEm(-0.15, 20),
      lineHeight: 28 / 20,
    },
    subtitle1: {
      fontFamily: HEADING_FONT,
      fontWeight: 600,
      fontSize: toRem(16),
      letterSpacing: toEm(0.2, 16),
      lineHeight: 24 / 16,
    },
    subtitle2: {
      fontFamily: HEADING_FONT,
      fontWeight: 600,
      fontSize: toRem(14),
      letterSpacing: toEm(0.25, 14),
      lineHeight: 20 / 14,
    },
    body1: {
      fontSize: toRem(16),
      letterSpacing: toEm(0.5, 16),
      lineHeight: 24 / 16,
    },
    body2: {
      fontSize: toRem(14),
      letterSpacing: toEm(0.25, 14),
      lineHeight: 20 / 14,
    },
    button: {
      fontWeight: 500,
      fontSize: toRem(14),
      letterSpacing: toEm(0.25, 14),
      lineHeight: 20 / 14,
      textTransform: "none",
    },
    caption: {
      fontSize: toRem(12),
      letterSpacing: toEm(0.4, 12),
      lineHeight: 20 / 12,
    },
    overline: {
      fontSize: toRem(12),
      letterSpacing: toEm(1.5, 12),
      lineHeight: 20 / 12,
    },
  },
});
