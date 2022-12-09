import { lazy, Suspense, useState } from "react";
import { IProjectSettingsChildProps } from "@src/pages/Settings/ProjectSettingsPage";
import { merge, unset } from "lodash-es";

import { FormControlLabel, Checkbox, Collapse } from "@mui/material";
import Loading from "@src/components/Loading";

// prettier-ignore
const ThemeColorPicker = lazy(() => import("@src/components/Settings/ThemeColorPicker") /* webpackChunkName: "ThemeColorPicker" */);

export default function Customization({
  publicSettings,
  updatePublicSettings,
}: IProjectSettingsChildProps) {
  const [customizedThemeColor, setCustomizedThemeColor] = useState(
    (publicSettings.theme?.light?.palette?.primary as any)?.main ||
      (publicSettings.theme?.dark?.palette?.primary as any)?.main
  );

  const handleSave = ({ light, dark }: { light: string; dark: string }) => {
    updatePublicSettings({
      theme: merge(publicSettings.theme, {
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
                const newTheme = publicSettings.theme;
                unset(newTheme, "light.palette.primary.main");
                unset(newTheme, "dark.palette.primary.main");
                updatePublicSettings({ theme: newTheme });
              }
            }}
          />
        }
        label="Customize theme colors for all users"
        sx={{ my: -10 / 8 }}
      />

      <Collapse in={customizedThemeColor} style={{ marginTop: 0 }}>
        <Suspense fallback={<Loading />}>
          <ThemeColorPicker
            currentLight={
              (publicSettings.theme?.light?.palette?.primary as any)?.main
            }
            currentDark={
              (publicSettings.theme?.dark?.palette?.primary as any)?.main
            }
            handleSave={handleSave}
          />
        </Suspense>
      </Collapse>
    </>
  );
}
