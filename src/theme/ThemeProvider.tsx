import { useEffect } from "react";
import { useAtom } from "jotai";
import { Helmet } from "react-helmet-async";
import {
  useMediaQuery,
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
} from "@mui/material";

import { globalScope } from "@src/atoms/globalScope";
import {
  themeAtom,
  themeOverriddenAtom,
  customizedThemesAtom,
} from "@src/atoms/user";

/**
 * Injects the MUI theme with customizations from project and user settings.
 * Also adds dark mode support.
 */
export default function ThemeProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [theme, setTheme] = useAtom(themeAtom, globalScope);
  const [themeOverridden] = useAtom(themeOverriddenAtom, globalScope);
  const [customizedThemes] = useAtom(customizedThemesAtom, globalScope);

  // Infer theme based on system settings
  const prefersDarkTheme = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  // Update theme when system settings change
  useEffect(() => {
    if (themeOverridden) return;
    setTheme(prefersDarkTheme ? "dark" : "light");
  }, [prefersDarkTheme, themeOverridden, setTheme]);

  // Sync theme to body data-theme attribute for Feedback Fin
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      {Array.isArray(customizedThemes[theme].typography.fontCssUrls) && (
        <Helmet>
          {customizedThemes[theme].typography.fontCssUrls!.map((url) => (
            <link key={url} rel="stylesheet" href={url} />
          ))}
        </Helmet>
      )}

      <MuiThemeProvider theme={customizedThemes[theme]}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </>
  );
}
