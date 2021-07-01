import { TextField } from "@material-ui/core";
import Subheading from "components/Table/ColumnMenu/Subheading";

import _sortBy from "lodash/sortBy";

export default function Settings({ handleChange, config }) {
  return (
    <>
      <Subheading>Short Text Config</Subheading>
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
      <Subheading>Validation Regex</Subheading>
      <TextField
        type="text"
        value={config.maxLength}
        label={"Validation Regex"}
        fullWidth
        onChange={(e) => {
          if (e.target.value === "") handleChange("validationRegex")(null);
          else handleChange("validationRegex")(e.target.value);
        }}
      />
    </>
  );
}
