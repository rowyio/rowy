import React from "react";

import { TextField } from "@material-ui/core";
import SettingsHeading from "components/Table/ColumnMenu/Settings/SettingsHeading";

import _sortBy from "lodash/sortBy";

const Settings = ({ handleChange, config }) => {
  return (
    <>
      <SettingsHeading>Short Text Config</SettingsHeading>
      <TextField
            type="number"
            value={config.maxLength}
            label={"Character Limit"}
            fullWidth
            onChange={(e) => {
              if (e.target.value === "0") handleChange("maxLength")(null);
              else handleChange("maxLength")(e.target.value);
            }}
          />
    </>
  );
};

export default Settings;
