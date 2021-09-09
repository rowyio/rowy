import { useEffect, useState } from "react";
import { ISettingsProps } from "../types";
import _sortBy from "lodash/sortBy";

import { TextField } from "@material-ui/core";
import MultiSelect from "@antlerengineering/multiselect";

import { FieldType } from "constants/fields";
import { db } from "../../../firebase";
import { useProjectContext } from "contexts/ProjectContext";
import { TABLE_SCHEMAS } from "config/dbPaths";

export default function Settings({ handleChange, config }: ISettingsProps) {
  const { tables } = useProjectContext();
  const tableOptions = _sortBy(
    tables?.map((t) => ({
      label: `${t.section} – ${t.name} (${t.collection})`,
      value: t.id,
    })) ?? [],
    "label"
  );

  const [columns, setColumns] = useState<
    { value: string; label: string; type: FieldType }[]
  >([]);
  const getColumns = async (table) => {
    const tableConfigDoc = await db.doc(`${TABLE_SCHEMAS}/${table}`).get();
    const tableConfig = tableConfigDoc.data();
    if (tableConfig && tableConfig.columns)
      setColumns(
        Object.values(tableConfig.columns).map((c: any) => ({
          label: c.name,
          value: c.key,
          type: c.type,
        }))
      );
  };
  useEffect(() => {
    if (config.index) {
      getColumns(config.index);
    }
  }, [config.index]);

  return (
    <>
      <MultiSelect
        options={tableOptions}
        freeText={false}
        value={config.index}
        onChange={handleChange("index")}
        multiple={false}
        label="Table"
        labelPlural="Tables"
      />
      <TextField
        label="Filter Template"
        name="filters"
        fullWidth
        value={config.filters}
        onChange={(e) => {
          handleChange("filters")(e.target.value);
        }}
      />
      <MultiSelect
        label={"Primary Keys"}
        value={config.primaryKeys ?? []}
        options={columns.filter((c) =>
          [FieldType.shortText, FieldType.singleSelect].includes(c.type)
        )}
        onChange={handleChange("primaryKeys")}
      />
      <MultiSelect
        label={"Snapshot Fields"}
        value={config.snapshotFields ?? []}
        options={columns.filter((c) => ![FieldType.subTable].includes(c.type))}
        onChange={handleChange("snapshotFields")}
      />
      <MultiSelect
        label={"Tracked Fields"}
        value={config.trackedFields ?? []}
        options={columns.filter((c) => ![FieldType.subTable].includes(c.type))}
        onChange={handleChange("trackedFields")}
      />
    </>
  );
}
