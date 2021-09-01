import { createTheme, ThemeOptions } from "@material-ui/core/styles";
import _merge from "lodash/merge";

import { typography } from "theme/typography";
import { colorsLight, colorsDark } from "theme/colors";
import { components } from "theme/components";

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
