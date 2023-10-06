import { merge } from "lodash-es";
import { IUserSettingsChildProps } from "@src/pages/Settings/UserSettingsPage";

import {
  FormControl,
  FormControlLabel,
  Divider,
  Checkbox,
  Collapse,
} from "@mui/material";

export default function TableSettings({
  settings,
  updateSettings,
}: IUserSettingsChildProps) {
  return (
    <>
      <FormControl sx={{ my: -10 / 10, display: "flex" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(
                settings.defaultTableSettings?.saveSortsPopupDisabled
              )}
              onChange={(e) => {
                updateSettings({
                  defaultTableSettings: merge(settings.defaultTableSettings, {
                    saveSortsPopupDisabled: e.target.checked,
                  }),
                });
              }}
            />
          }
          label="Disable popup - to save sorting changes to the team"
          style={{ marginLeft: -11, marginBottom: 13 }}
        />
        <Collapse in={settings.defaultTableSettings?.saveSortsPopupDisabled}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(
                  settings.defaultTableSettings?.automaticallyApplySorts
                )}
                onChange={(e) => {
                  updateSettings({
                    defaultTableSettings: merge(settings.defaultTableSettings, {
                      automaticallyApplySorts: e.target.checked,
                    }),
                  });
                }}
              />
            }
            label="Automatically apply sorting changes to all users"
            style={{ marginLeft: 20, marginBottom: 10, marginTop: -13 }}
          />
        </Collapse>

        <Divider />

        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(
                settings.defaultTableSettings?.saveColumnSizingPopupDisabled
              )}
              onChange={(e) => {
                updateSettings({
                  defaultTableSettings: merge(settings.defaultTableSettings, {
                    saveColumnSizingPopupDisabled: e.target.checked,
                  }),
                });
              }}
            />
          }
          label="Disable popup - to save column width changes to the team"
          style={{ marginLeft: -11, marginTop: 13 }}
        />
        <Collapse
          in={settings.defaultTableSettings?.saveColumnSizingPopupDisabled}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(
                  settings.defaultTableSettings?.automaticallyApplyColumnSizing
                )}
                onChange={(e) => {
                  updateSettings({
                    defaultTableSettings: merge(settings.defaultTableSettings, {
                      automaticallyApplyColumnSizing: e.target.checked,
                    }),
                  });
                }}
              />
            }
            label="Automatically apply column width changes to all users"
            style={{ marginLeft: 20 }}
          />
        </Collapse>
      </FormControl>
    </>
  );
}
