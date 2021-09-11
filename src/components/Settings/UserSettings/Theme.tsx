import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { useAppContext } from "contexts/AppContext";

export default function Theme() {
  const { theme, themeOverridden, setTheme, setThemeOverridden } =
    useAppContext();

  return (
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
  );
}
