import { lazy, Suspense, useState } from "react";
import { IUserSettingsChildProps } from "pages/Settings/UserSettings";

import { FormControlLabel, Checkbox, Collapse } from "@mui/material";
import Loading from "components/Loading";

// prettier-ignore
const ThemeColorPicker = lazy(() => import("components/Settings/ThemeColorPicker") /* webpackChunkName: "Settings/ThemeColorPicker" */);

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
      theme: {
        light: { palette: { primary: { main: light } } },
        dark: { palette: { primary: { main: dark } } },
      },
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
              if (!e.target.checked) updateSettings({ theme: {} });
            }}
          />
        }
        label="Customize theme colors"
        sx={{ my: -10 / 8 }}
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
