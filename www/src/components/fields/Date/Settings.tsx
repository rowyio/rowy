import { ISettingsProps } from "../types";
import _sortBy from "lodash/sortBy";
import Subheading from "components/Table/ColumnMenu/Subheading";
import MultiSelect from "@antlerengineering/multiselect";
import { DATE_FORMAT } from "constants/dates";

export default function Settings({ handleChange, config }: ISettingsProps) {
  return (
    <>
      <Subheading>Date Config</Subheading>
      <MultiSelect
        options={["yyyy/MM/dd", "dd/MM/yyyy", "MM/dd/yyyy"]}
        label="Format"
        freeText={false}
        value={config.format ?? DATE_FORMAT}
        onChange={handleChange("format")}
        multiple={false}
      />
    </>
  );
}
