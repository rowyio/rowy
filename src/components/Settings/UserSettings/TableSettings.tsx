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
                settings.defaultTableSettings?.saveSortingPopupDisabled
              )}
              onChange={(e) => {
                updateSettings({
                  defaultTableSettings: merge(settings.defaultTableSettings, {
                    saveSortingPopupDisabled: e.target.checked,
                  }),
                });
              }}
            />
          }
          label="Disable popup - to save sorting changes to the team"
          style={{ marginLeft: -11, marginBottom: 13 }}
        />
        <Collapse in={settings.defaultTableSettings?.saveSortingPopupDisabled}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(
                  settings.defaultTableSettings?.automaticallyApplySorting
                )}
                onChange={(e) => {
                  updateSettings({
                    defaultTableSettings: merge(settings.defaultTableSettings, {
                      automaticallyApplySorting: e.target.checked,
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
                settings.defaultTableSettings?.saveColumnWidthPopupDisabled
              )}
              onChange={(e) => {
                updateSettings({
                  defaultTableSettings: merge(settings.defaultTableSettings, {
                    saveColumnWidthPopupDisabled: e.target.checked,
                  }),
                });
              }}
            />
          }
          label="Disable popup - to save column width changes to the team"
          style={{ marginLeft: -11, marginTop: 13 }}
        />
        <Collapse
          in={settings.defaultTableSettings?.saveColumnWidthPopupDisabled}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(
                  settings.defaultTableSettings?.automaticallyApplyColumnWidth
                )}
                onChange={(e) => {
                  updateSettings({
                    defaultTableSettings: merge(settings.defaultTableSettings, {
                      automaticallyApplyColumnWidth: e.target.checked,
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
