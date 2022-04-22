import { createTheme, ThemeOptions } from "@mui/material/styles";
import _merge from "lodash/merge";

import { typography } from "@src/theme/typography";
import { colorsLight, colorsDark } from "@src/theme/colors";
import { components } from "@src/theme/components";

export const customizableLightTheme = (customization: ThemeOptions) => {
  const customizedLightThemeBase = createTheme(
    _merge(
      {},
      typography((customization?.typography as any) ?? {}),
      colorsLight((customization?.palette?.primary as any)?.main)
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
      colorsDark(
        (customization?.palette?.primary as any)?.main,
        (customization?.palette as any)?.darker
      )
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

const themes = {
  light: customizableLightTheme,
  dark: customizableDarkTheme,
};
export default themes;
