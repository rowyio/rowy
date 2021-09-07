import { lazy, Suspense, useState } from "react";
import { IProjectSettingsChildProps } from "pages/Settings/ProjectSettings";

import { FormControlLabel, Checkbox, Collapse } from "@material-ui/core";
import Loading from "components/Loading";

// prettier-ignore
const ThemeColorPicker = lazy(() => import("components/Settings/ThemeColorPicker") /* webpackChunkName: "Settings/ThemeColorPicker" */);

export default function Customization({
  publicSettings,
  updatePublicSettings,
}: IProjectSettingsChildProps) {
  const [customizedThemeColor, setCustomizedThemeColor] = useState(
    publicSettings.theme?.light?.palette?.primary?.main ||
      publicSettings.theme?.dark?.palette?.primary?.main
  );

  const handleSave = ({ light, dark }: { light: string; dark: string }) => {
    updatePublicSettings({
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
              if (!e.target.checked) updatePublicSettings({ theme: {} });
            }}
          />
        }
        label="Customize theme colors for all users"
        sx={{ my: -10 / 8 }}
      />

      <Collapse in={customizedThemeColor} style={{ marginTop: 0 }}>
        <Suspense fallback={<Loading />}>
          <ThemeColorPicker
            currentLight={publicSettings.theme?.light?.palette?.primary?.main}
            currentDark={publicSettings.theme?.dark?.palette?.primary?.main}
            handleSave={handleSave}
          />
        </Suspense>
      </Collapse>
    </>
  );
}
