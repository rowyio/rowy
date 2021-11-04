import { lazy, Suspense, useState } from "react";
import { IUserSettingsChildProps } from "@src/pages/Settings/UserSettings";
import _merge from "lodash/merge";
import _unset from "lodash/unset";

import { FormControlLabel, Checkbox, Collapse } from "@mui/material";
import Loading from "@src/components/Loading";

// prettier-ignore
const ThemeColorPicker = lazy(() => import("@src/components/Settings/ThemeColorPicker") /* webpackChunkName: "Settings/ThemeColorPicker" */);

export default function Personalization({
  settings,
  updateSettings,
}: IUserSettingsChildProps) {
  const [customizedThemeColor, setCustomizedThemeColor] = useState(
    settings.theme?.light?.palette?.primary?.main ||
      settings.theme?.dark?.palette?.primary?.main
  );

  const handleSave = ({ light, dark }: { light: string; dark: string }) => {
    updateSettings({
      theme: _merge(settings.theme, {
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
            checked={customizedThemeColor}
            onChange={(e) => {
              setCustomizedThemeColor(e.target.checked);
              if (!e.target.checked) {
                const newTheme = settings.theme;
                _unset(newTheme, "light.palette.primary.main");
                _unset(newTheme, "dark.palette.primary.main");
                updateSettings({ theme: newTheme });
              }
            }}
          />
        }
        label="Customize theme colors"
        style={{ marginLeft: -11, marginBottom: -10, marginTop: -10 }}
      />

      <Collapse in={customizedThemeColor} style={{ marginTop: 0 }}>
        <Suspense fallback={<Loading />}>
          <ThemeColorPicker
            currentLight={settings.theme?.light?.palette?.primary?.main}
            currentDark={settings.theme?.dark?.palette?.primary?.main}
            handleSave={handleSave}
          />
        </Suspense>
      </Collapse>
    </>
  );
}
