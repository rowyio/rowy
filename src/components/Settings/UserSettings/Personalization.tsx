import { lazy, Suspense, useState } from "react";
import { IUserSettingsChildProps } from "@src/pages/Settings/UserSettingsPage";
import { merge, unset } from "lodash-es";

import { FormControlLabel, Checkbox, Collapse } from "@mui/material";
import Loading from "@src/components/Loading";

// prettier-ignore
const ThemeColorPicker = lazy(() => import("@src/components/Settings/ThemeColorPicker") /* webpackChunkName: "ThemeColorPicker" */);

export default function Personalization({
  settings,
  updateSettings,
}: IUserSettingsChildProps) {
  const [customizedThemeColor, setCustomizedThemeColor] = useState(
    Boolean(
      (settings.theme?.light?.palette?.primary as any)?.main ||
        (settings.theme?.dark?.palette?.primary as any)?.main
    )
  );

  const handleSave = ({ light, dark }: { light: string; dark: string }) => {
    updateSettings({
      theme: merge(settings.theme, {
        light: { palette: { primary: { main: light } } },
        dark: { palette: { primary: { main: dark } } },
      }),
    });
  };

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked={customizedThemeColor}
            onChange={(e) => {
              setCustomizedThemeColor(e.target.checked);
              if (!e.target.checked) {
                const newTheme = settings.theme;
                unset(newTheme, "light.palette.primary.main");
                unset(newTheme, "dark.palette.primary.main");
                updateSettings({ theme: newTheme });
              }
            }}
          />
        }
        label="Customize theme colors"
        style={{ marginLeft: -11, marginBottom: -10, marginTop: -10 }}
      />

      <Collapse in={customizedThemeColor} style={{ marginTop: 0 }}>
        <Suspense fallback={<Loading style={{ height: "auto" }} />}>
          <ThemeColorPicker
            currentLight={
              (settings.theme?.light?.palette?.primary as any)?.main
            }
            currentDark={(settings.theme?.dark?.palette?.primary as any)?.main}
            handleSave={handleSave}
          />
        </Suspense>
      </Collapse>
    </>
  );
}
