import { ThemeOptions, createTheme } from "@material-ui/core/styles";
import { Shadows } from "@material-ui/core/styles/shadows";
import chroma from "chroma-js";

export const PRIMARY = "#421AFD";
// export const PRIMARY = "#ED4747";
// export const PRIMARY = "#FA0";
// export const PRIMARY = "#0F0";
// export const PRIMARY = "#F15A29";
// export const PRIMARY = "#c4492c";
export const ERROR = "#B00020"; // https://material.io/design/color/dark-theme.html#ui-application
export const SUCCESS = "#27CD41";

const defaultTheme = createTheme();

export const lightThemeColors = (
  _primary: string | number | chroma.Color = PRIMARY
): ThemeOptions => {
  const primary = chroma(_primary);
  const secondary = chroma.lch(10, 20, primary.get("lch.h"));
  const bgDefault = chroma.lch(98, 1, primary.get("lch.h"));
  const shadowBase = chroma.lch(0, 20, primary.get("lch.h"));
  const tooltip = shadowBase.alpha(0.8);

  return {
    palette: {
      primary: { main: primary.css("hsl") },
      secondary: { main: secondary.css("hsl") },
      error: { main: ERROR },
      success: { main: SUCCESS },
      background: { default: bgDefault.css("hsl") },
    },
    shadows: new Array(25).fill(undefined).map((_, i) => {
      // Based on https://tailwindcss.com/docs/box-shadow
      // with additional “outline” shadow
      // and bigger shadow from https://github.com/outline/outline/blob/37fd7ec97a496094077a59f4d10fa0081516e3ef/shared/theme.js#L148

      if (i === 0) return "none";

      if (i < 4)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.04).css()}, 0 1px 3px 0 ${shadowBase.alpha(0.1).css()}, 0 1px 2px 0 ${shadowBase.alpha(0.06).css()}`;

      if (i < 8)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.05).css()}, 0 4px 6px -1px ${shadowBase.alpha(0.1).css()}, 0 2px 4px ${shadowBase.alpha(0.06).css()}`;

      if (i < 16)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.06).css()}, 0 10px 15px -3px ${shadowBase.alpha(0.1).css()}, 0 4px 6px ${shadowBase.alpha(0.05).css()}, 0 30px 40px ${shadowBase.alpha(0.05).css()}`;

      if (i < 24)
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.08).css()}, 0 20px 25px -5px ${shadowBase.alpha(0.1).css()}, 0 10px 10px ${shadowBase.alpha(0.04).css()}, 0 40px 60px ${shadowBase.alpha(0.06).css()}`;

      else
        // prettier-ignore
        return `0 0 0 1px ${shadowBase.alpha(0.08).css()}, 0 25px 50px -12px ${shadowBase.alpha(0.25).css()}, 0 50px 80px ${shadowBase.alpha(0.06).css()}`;
    }) as Shadows,

    components: {
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: chroma
              .lch(0, 1, primary.get("lch.h"))
              .alpha(0.6)
              .css(),
          },
          invisible: { backgroundColor: "transparent" },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: tooltip.css() },
        },
      },
      MuiSlider: {
        styleOverrides: {
          valueLabel: { backgroundColor: secondary.css() },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              color: defaultTheme.palette.augmentColor({
                color: { main: primary.css("hsl") },
              }).dark,
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            ".Mui-selected &": {
              color: defaultTheme.palette.augmentColor({
                color: { main: primary.css("hsl") },
              }).dark,
            },
          },
        },
      },
    },
  };
};
