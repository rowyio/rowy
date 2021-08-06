import { useEffect, useState } from "react";
import { ISettingsProps } from "../types";
import _sortBy from "lodash/sortBy";

import { TextField } from "@material-ui/core";
import Subheading from "components/Table/ColumnMenu/Subheading";
import MultiSelect from "@antlerengineering/multiselect";

import { FieldType } from "constants/fields";
import { db } from "../../../firebase";
import { useFiretableContext } from "contexts/FiretableContext";

export default function Settings({ handleChange, config }: ISettingsProps) {
  const { tables } = useFiretableContext();
  const tableOptions = _sortBy(
    tables?.map((t) => ({
      label: `${t.section} - ${t.name}`,
      value: t.collection,
    })) ?? [],
    "label"
  );

  const [columns, setColumns] = useState<
    { value: string; label: string; type: FieldType }[]
  >([]);
  const getColumns = async (table) => {
    const tableConfigDoc = await db
      .doc(`_FIRETABLE_/settings/schema/${table}`)
      .get();
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
      <Subheading>Table Connect Config</Subheading>
      <MultiSelect
        options={tableOptions}
        freeText={false}
        value={config.index}
        onChange={handleChange("index")}
        multiple={false}
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
