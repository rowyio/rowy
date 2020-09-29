import { Table, useFiretableContext } from "../contexts/firetableContext";
import MultiSelect, { Option } from "@antlerengineering/multiselect";
import React from "react";

const TableSelector = ({
  value,
  handleChange,
  label,
}: {
  value?: String;
  handleChange: any;
  label?: string;
}) => {
  const { tables } = useFiretableContext();
  if (!tables) return <></>;

  const options: Option<Table>[] = [];
  for (const t of tables) {
    options.push({
      value: t,
      label: `${t.name}`,
    });
  }
  const selectedTables = tables.filter((t) => t.collection === value);
  let tableValue: Table | null = null;
  if (selectedTables.length > 0) {
    tableValue = selectedTables[0];
  }

  return (
    <MultiSelect<Table>
      label={label}
      onChange={handleChange}
      options={options}
      value={tableValue}
      multiple={false}
      freeText
    />
  );
};

export default TableSelector;
