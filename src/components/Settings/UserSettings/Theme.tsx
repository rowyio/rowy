import { IUserSettingsChildProps } from "@src/pages/Settings/UserSettings";
import _merge from "lodash/merge";

import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Checkbox,
} from "@mui/material";

import { useAppContext } from "@src/contexts/AppContext";

export default function Theme({
  settings,
  updateSettings,
}: IUserSettingsChildProps) {
  const { theme, themeOverridden, setTheme, setThemeOverridden } =
    useAppContext();

  return (
    <>
      <FormControl component="fieldset" variant="standard" sx={{ my: -10 / 8 }}>
        <legend style={{ fontSize: 0 }}>Theme</legend>

        <RadioGroup
          value={themeOverridden ? theme : "system"}
          onChange={(e) => {
            if (e.target.value === "system") {
              setThemeOverridden(false);
            } else {
              setTheme(e.target.value as typeof theme);
              setThemeOverridden(true);
            }
          }}
        >
          <FormControlLabel
            control={<Radio />}
            value="system"
            label="Match system theme"
          />
          <FormControlLabel control={<Radio />} value="light" label="Light" />
          <FormControlLabel control={<Radio />} value="dark" label="Dark" />
        </RadioGroup>
      </FormControl>

      <Divider />

      <FormControlLabel
        control={
          <Checkbox
            checked={settings.theme?.dark?.palette?.darker}
            onChange={(e) => {
              updateSettings({
                theme: _merge(settings.theme, {
                  dark: { palette: { darker: e.target.checked } },
                }),
              });
            }}
          />
        }
        label="Darker dark theme"
        style={{ marginLeft: -11, marginBottom: -10, marginTop: 13 }}
      />
    </>
  );
}
