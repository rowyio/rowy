import { useEffect } from "react";
import { useAtom } from "jotai";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";

import { useMediaQuery, ThemeProvider, CssBaseline } from "@mui/material";
import Favicon from "@src/assets/Favicon";

import {
  globalScope,
  themeAtom,
  themeOverriddenAtom,
  customizedThemesAtom,
} from "@src/atoms/globalScope";

/**
 * Injects the MUI theme with customizations from project and user settings.
 * Also adds dark mode support.
 */
export default function RowyThemeProvider({
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

  const fontCssUrls = customizedThemes[theme].typography.fontCssUrls;

  return (
    <>
      {Array.isArray(fontCssUrls) && (
        <Helmet>
          {fontCssUrls!.map((url) => (
            <link key={url} rel="stylesheet" href={url} />
          ))}
        </Helmet>
      )}

      <ThemeProvider theme={customizedThemes[theme]}>
        <Favicon />
        <CssBaseline />
        {children}
        <Outlet />
      </ThemeProvider>
    </>
  );
}
