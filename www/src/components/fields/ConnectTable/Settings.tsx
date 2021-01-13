import React from "react";
import _sortBy from "lodash/sortBy";

import { TextField } from "@material-ui/core";
import MultiSelect from "@antlerengineering/multiselect";
import ColumnSelector from "components/Table/ColumnMenu/Settings/ConfigFields/ColumnSelector";
import { FieldType } from "components/fields/types";

export default function Settings({ config, tables, handleChange }) {
  const tableOptions = _sortBy(
    tables?.map((t) => ({
      label: `${t.section} - ${t.name}`,
      value: t.collection,
    })) ?? [],
    "label"
  );

  return (
    <>
      <MultiSelect
        options={tableOptions}
        freeText={false}
        value={config.index}
        onChange={handleChange("index")}
        multiple={false}
      />
      <ColumnSelector
        label={"Primary Keys"}
        value={config.primaryKeys}
        table={config.index}
        handleChange={handleChange("primaryKeys")}
        validTypes={[FieldType.shortText, FieldType.singleSelect]}
      />
      <TextField
        label="filter template"
        name="filters"
        fullWidth
        value={config.filters}
        onChange={(e) => {
          handleChange("filters")(e.target.value);
        }}
      />
    </>
  );
}
