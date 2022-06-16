import { ThemeOptions } from "@mui/material/styles";
import {
  FontStyle,
  TypographyStyleOptions,
} from "@mui/material/styles/createTypography";

import "./space-grotesk.css";

declare module "@mui/material/styles/createTypography" {
  interface FontStyle {
    fontFamilyMono: string;
    fontFamilyHeading: string;
    fontCssUrls?: string[];
  }
}

export const BODY_FONT = "Inter, system-ui, sans-serif";
export const HEADING_FONT = "Space Grotesk, " + BODY_FONT;
export const MONO_FONT = "JetBrains Mono, ui-monospace, monospace";

export const ROOT_FONT_SIZE = 16;
export const toRem = (px: number) => `${px / ROOT_FONT_SIZE}rem`;
export const toEm = (px: number, root: number) => `${px / root}em`;

export const typography = ({
  fontFamily: customizedFontFamily,
  fontFamilyMono: customizedFontFamilyMono,
  fontFamilyHeading: customizedFontFamilyHeading,

  fontWeightLight = 300,
  fontWeightRegular = 400,
  fontWeightMedium = 500,
  fontWeightBold = 600,
}: Partial<ThemeOptions["typography"] & FontStyle>): ThemeOptions => {
  const fontFamily = [customizedFontFamily, BODY_FONT]
    .filter((x) => x)
    .join(", ");
  const fontFamilyMono = [customizedFontFamilyMono, MONO_FONT]
    .filter((x) => x)
    .join(", ");
  const fontFamilyHeading = [customizedFontFamilyHeading, HEADING_FONT]
    .filter((x) => x)
    .join(", ");

  const fontStyleBody: TypographyStyleOptions = {
    fontFamily,
    fontFeatureSettings:
      fontFamily !== BODY_FONT
        ? "normal"
        : `"calt", "ss01", "ss03", "cv05", "cv08", "cv09"`,
    WebkitFontSmoothing: "auto",
    MozOsxFontSmoothing: "auto",
  };
  const fontStyleHeading: TypographyStyleOptions = {
    fontFamily: fontFamilyHeading,
    fontFeatureSettings:
      fontFamilyHeading !== HEADING_FONT ? "normal" : `"ss02", "ss03"`,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  return {
    typography: {
      fontFamily,
      fontFamilyMono,
      fontFamilyHeading,

      fontWeightLight,
      fontWeightRegular,
      fontWeightMedium,
      fontWeightBold,

      h1: {
        ...fontStyleHeading,
        fontWeight: fontWeightBold,
        fontSize: toRem(96),
        letterSpacing: toEm(-1.5, 96),
        lineHeight: 112 / 96,
      },
      h2: {
        ...fontStyleHeading,
        fontWeight: fontWeightBold,
        fontSize: toRem(60),
        letterSpacing: toEm(-0.75, 60),
        lineHeight: 72 / 60,
      },
      h3: {
        ...fontStyleHeading,
        fontWeight: fontWeightBold,
        fontSize: toRem(48),
        letterSpacing: toEm(-0.5, 48),
        lineHeight: 60 / 48,
      },
      h4: {
        ...fontStyleHeading,
        fontWeight: fontWeightBold,
        fontSize: toRem(34),
        letterSpacing: toEm(-0.35, 34),
        lineHeight: 44 / 34,
      },
      h5: {
        ...fontStyleHeading,
        fontWeight: fontWeightBold,
        fontSize: toRem(24),
        letterSpacing: "0",
        // letterSpacing: toEm(-0.2, 24),
        lineHeight: 32 / 24,
      },
      h6: {
        ...fontStyleHeading,
        fontWeight: fontWeightBold,
        fontSize: toRem(20),
        letterSpacing: "0",
        // letterSpacing: toEm(-0.15, 20),
        lineHeight: 28 / 20,
      },
      subtitle1: {
        ...fontStyleHeading,
        fontWeight: fontWeightBold,
        fontSize: toRem(17),
        letterSpacing: toEm(0.2, 16),
        lineHeight: 24 / 17,
      },
      subtitle2: {
        ...fontStyleHeading,
        fontWeight: fontWeightBold,
        fontSize: toRem(15),
        letterSpacing: toEm(0.25, 14),
        lineHeight: 20 / 15,
      },
      body1: {
        ...fontStyleBody,
        fontSize: toRem(16),
        letterSpacing: toEm(0.5, 16),
        lineHeight: 24 / 16,
      },
      body2: {
        ...fontStyleBody,
        fontSize: toRem(14),
        letterSpacing: toEm(0.25, 14),
        lineHeight: 20 / 14,
      },
      button: {
        ...fontStyleBody,
        fontWeight: fontWeightMedium,
        fontSize: toRem(14),
        letterSpacing: toEm(0.25, 14),
        lineHeight: 20 / 14,
        textTransform: "none",
      },
      caption: {
        ...fontStyleBody,
        fontSize: toRem(12),
        letterSpacing: toEm(0.4, 12),
        lineHeight: 20 / 12,
      },
      overline: {
        ...fontStyleBody,
        fontSize: toRem(12),
        letterSpacing: toEm(1.5, 12),
        lineHeight: 20 / 12,
      },
    },
    components: {
      MuiTypography: {
        defaultProps: { variant: "body2" },
      },
      MuiLink: {
        styleOverrides: {
          root: { textUnderlineOffset: toRem(1) },
        },
      },
    },
  };
};
