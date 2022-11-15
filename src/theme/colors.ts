import { colord } from "colord";
import { ThemeOptions } from "@mui/material/styles";
import { Shadows } from "@mui/material/styles/shadows";

declare module "@mui/material/styles/createPalette" {
  interface TypeAction {
    activeOpacity: number;
    input: string;
    inputOutline: string;
  }
}

export const PRIMARY = "#4200FF";
export const ERROR = "#B00020"; // https://material.io/design/color/dark-theme.html#ui-application
export const DARK_PRIMARY = "#B0B6FD"; // l: 75, c: 65, h: 275

export const colorsLight = (
  _primary: Parameters<typeof colord>[0] = PRIMARY
): ThemeOptions => {
  const primary = colord(_primary);
  const h = primary.toLch().h;
  const secondary = colord({ l: 10, c: 10, h });
  const secondaryDark = colord({ l: 0, c: 0, h });
  const bgDefault = colord({ l: 98, c: 1, h });
  const textBase = colord({ l: 0, c: 10, h });
  const shadowBase = colord({ l: 0, c: 10, h });
  const tooltip = shadowBase.alpha(0.8);

  return {
    palette: {
      primary: { main: primary.toHslString() },
      secondary: {
        main: secondary.toHslString(),
        dark: secondaryDark.toHslString(),
      },
      error: { main: ERROR },
      success: { light: "#34c759", main: "#00802e", dark: "#105e24" },
      background: { default: bgDefault.toHslString() },
      text: {
        primary: textBase.alpha(0.87).toHslString(),
        secondary: textBase.alpha(0.6).toHslString(),
        disabled: textBase.alpha(0.38).toHslString(),
      },
      action: {
        active: textBase.alpha(0.6).toHslString(),
        activeOpacity: 0.6,
        hover: textBase.alpha(0.04).toHslString(),
        selected: textBase.alpha(0.08).toHslString(),
        disabled: textBase.alpha(0.26).toHslString(),
        disabledBackground: textBase.alpha(0.12).toHslString(),
        input: "#fff",
        inputOutline: shadowBase.alpha(0.1).toRgbString(),
      },
      divider: shadowBase.alpha(0.12).toRgbString(), // Using hsl string breaks table borders
    },
    shadows: new Array(25).fill(undefined).map((_, i) => {
      // Based on https://tailwindcss.com/docs/box-shadow
      // with additional “outline” shadow
      // and bigger shadow from https://github.com/outline/outline/blob/37fd7ec97a496094077a59f4d10fa0081516e3ef/shared/theme.js#L148

      if (i === 0) return "none";

      if (i === 1)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.03).toHslString()}, 0 1px 2px 0 ${shadowBase.alpha(0.1).toHslString()}`;

      if (i < 4)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.04).toHslString()}, 0 1px 3px 0 ${shadowBase.alpha(0.1).toHslString()}, 0 1px 2px 0 ${shadowBase.alpha(0.06).toHslString()}`;

      if (i < 8)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.05).toHslString()}, 0 4px 6px -1px ${shadowBase.alpha(0.1).toHslString()}, 0 2px 4px ${shadowBase.alpha(0.06).toHslString()}`;

      if (i < 16)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.06).toHslString()}, 0 10px 15px -3px ${shadowBase.alpha(0.1).toHslString()}, 0 4px 6px ${shadowBase.alpha(0.05).toHslString()}, 0 30px 40px ${shadowBase.alpha(0.05).toHslString()}`;

      if (i < 24)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.08).toHslString()}, 0 20px 25px -5px ${shadowBase.alpha(0.1).toHslString()}, 0 10px 10px ${shadowBase.alpha(0.04).toHslString()}, 0 40px 60px ${shadowBase.alpha(0.06).toHslString()}`;

      else
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.08).toHslString()}, 0 25px 50px -12px ${shadowBase.alpha(0.25).toHslString()}, 0 50px 80px ${shadowBase.alpha(0.06).toHslString()}`;
    }) as Shadows,

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": { colorScheme: "light" },
          "#root": { backgroundColor: bgDefault.toHslString() },
          ".rdg": { colorScheme: "light" },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: colord({ l: 70, c: 5, h })
              .alpha(0.6)
              .toHslString(),
            // ".MuiDialog-root:has(.MuiDialog-paperFullScreen) &": {
            //   backgroundColor: "rgba(0, 0, 0, 0)",
            // },
          },
          invisible: { backgroundColor: "transparent" },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: tooltip.toHslString() },
          arrow: { color: tooltip.toHslString() },
        },
      },
      MuiSlider: {
        styleOverrides: {
          valueLabel: { backgroundColor: secondary.toHslString() },
        },
      },
    },
  };
};

export const colorsDark = (
  _primary: Parameters<typeof colord>[0] = DARK_PRIMARY,
  darker?: boolean
): ThemeOptions => {
  const primary = colord(_primary);
  const h = primary.toLch().h;
  const secondary = colord({ l: 96, c: 1, h });
  const bgDefault = darker ? colord("#000") : colord({ l: 5, c: 2, h });
  const bgPaper = darker ? colord("#000") : bgDefault;
  const shadowBase = colord({ l: 0, c: 2, h });

  return {
    palette: {
      mode: "dark",
      primary: { main: primary.toHslString() },
      secondary: { main: secondary.toHslString() },
      background: {
        default: bgDefault.toHslString(),
        paper: bgPaper.toHslString(),
      },
      error: {
        main: colord({
          l: 75,
          c: 72,
          h: colord(ERROR).toLch().h,
        }).toHslString(),
      },
      action: {
        active: "rgba(255, 255, 255, 0.7)",
        activeOpacity: 0.7,
        hover: "rgba(255, 255, 255, 0.08)",
        hoverOpacity: 0.08,
        input: "rgba(255, 255, 255, 0.06)",
        inputOutline: "rgba(255, 255, 255, 0.06)",
      },
      // success: { light: "#34c759" },
    },
    shadows: new Array(25).fill(undefined).map((_, i) => {
      // Based on https://tailwindcss.com/docs/box-shadow
      // with additional “outline” shadow
      // and bigger shadow from https://github.com/outline/outline/blob/37fd7ec97a496094077a59f4d10fa0081516e3ef/shared/theme.js#L148

      if (i === 0) return "none";

      if (i === 1)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.03 * 4).toHslString()}, 0 1px 2px 0 ${shadowBase.alpha(0.1 * 4).toHslString()}`;

      if (i < 4)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.04 * 4).toHslString()}, 0 1px 3px 0 ${shadowBase.alpha(0.1 * 4).toHslString()}, 0 1px 2px 0 ${shadowBase.alpha(0.06 * 4).toHslString()}`;

      if (i < 8)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.05 * 4).toHslString()}, 0 4px 6px -1px ${shadowBase.alpha(0.1 * 4).toHslString()}, 0 2px 4px ${shadowBase.alpha(0.06 * 4).toHslString()}`;

      if (i < 16)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.06 * 4).toHslString()}, 0 10px 15px -3px ${shadowBase.alpha(0.1 * 4).toHslString()}, 0 4px 6px ${shadowBase.alpha(0.05 * 4).toHslString()}, 0 30px 40px ${shadowBase.alpha(0.05 * 4).toHslString()}`;

      if (i < 24)
          // prettier-ignore
          return `0 0 0 1px ${shadowBase.alpha(0.08 * 4).toHslString()}, 0 20px 25px -5px ${shadowBase.alpha(0.1 * 4).toHslString()}, 0 10px 10px ${shadowBase.alpha(0.04 * 4).toHslString()}, 0 40px 60px ${shadowBase.alpha(0.06 * 4).toHslString()}`;

        else
          // prettier-ignore
          return `0 0 0 1px ${shadowBase.alpha(0.08 * 4).toHslString()}, 0 25px 50px -12px ${shadowBase.alpha(0.25 * 4).toHslString()}, 0 50px 80px ${shadowBase.alpha(0.06 * 4).toHslString()}`;
    }) as Shadows,

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": { colorScheme: "dark" },
          "#root": { backgroundColor: bgDefault.toHslString() },
          ".rdg": { colorScheme: "dark" },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: colord({ l: 0, c: 1, h }).alpha(0.6).toHslString(),
            // ".MuiDialog-root:has(.MuiDialog-paperFullScreen) &": {
            //   backgroundColor: "rgba(0, 0, 0, 0)",
            // },
          },
          invisible: { backgroundColor: "transparent" },
        },
      },
    },
  };
};
