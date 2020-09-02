import React, { useState, useEffect } from "react";
import { FieldType } from "constants/fields";
import MultiSelect from "@antlerengineering/multiselect";
import { db } from "../../../../../firebase";
const ColumnSelector = ({
  tableColumns,
  handleChange,
  validTypes,
  table,
  value,
  label,
}: {
  tableColumns?: any[];
  handleChange: any;
  validTypes?: FieldType[];
  table?: string;
  value: any;
  label?: string;
}) => {
  const [columns, setColumns] = useState(tableColumns ?? []);
  const getColumns = async (table) => {
    const tableConfigDoc = await db
      .doc(`_FIRETABLE_/settings/schema/${table}`)
      .get();
    const tableConfig = tableConfigDoc.data();

    if (tableConfig) setColumns(tableConfig.columns ?? []);
  };
  useEffect(() => {
    if (table) {
      getColumns(table);
    }
  }, [table]);
  const options = columns
    ? Object.values(columns)
        .filter((col) => (validTypes ? validTypes.includes(col.type) : true))
        .map((col) => ({ value: col.key, label: col.name }))
    : [];
  return (
    <MultiSelect
      label={label}
      onChange={handleChange}
      value={value ?? []}
      options={options}
    />
  );
};

export default ColumnSelector;
