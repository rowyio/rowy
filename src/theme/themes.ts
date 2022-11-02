import { createTheme, ThemeOptions } from "@mui/material/styles";
import { merge } from "lodash-es";

import { breakpoints } from "./breakpoints";
import { typography } from "./typography";
import { colorsLight, colorsDark } from "./colors";
import { components } from "./components";

export const customizableLightTheme = (customization: ThemeOptions) => {
  const customizedLightThemeBase = createTheme(
    merge(
      {},
      breakpoints,
      typography((customization?.typography as any) ?? {}),
      colorsLight((customization?.palette?.primary as any)?.main)
    )
  );

  return createTheme(
    merge(
      {},
      customizedLightThemeBase,
      components(customizedLightThemeBase),
      customization
    )
  );
};

export const customizableDarkTheme = (customization: ThemeOptions) => {
  const customizedDarkThemeBase = createTheme(
    merge(
      {},
      breakpoints,
      typography((customization?.typography as any) ?? {}),
      colorsDark(
        (customization?.palette?.primary as any)?.main,
        (customization?.palette as any)?.darker
      )
    )
  );

  return createTheme(
    merge(
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
