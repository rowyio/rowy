import React from "react";
import { Outlet } from "react-router-dom";
import { extend } from "colord";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { merge } from "lodash-es";
// import { typography } from "../src/theme/typography";
import { breakpoints } from "../src/theme/breakpoints";
import { colorsDark } from "../src/theme/colors";

import mixPlugin from "colord/plugins/mix";
import lchPlugin from "colord/plugins/lch";
import a11yPlugin from "colord/plugins/a11y";
extend([mixPlugin, lchPlugin, a11yPlugin]);

const theme = createTheme(merge({}, breakpoints, colorsDark("#3f51b5")));
export default function RowyThemeProvider({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <Outlet />
    </ThemeProvider>
  );
}
