import { useState } from "react";
import { find } from "lodash-es";

import { getFieldType, getFieldProp } from "@src/components/fields";
import type { ColumnConfig, TableFilter } from "@src/types/table";
import type { IFieldConfig } from "@src/components/fields/types";

export const INITIAL_QUERY = { key: "", operator: "", value: "" };

export const useFilterInputs = (
  columns: ColumnConfig[],
  defaultQuery?: TableFilter
) => {
  // Get list of columns that can be filtered
  const filterColumns = columns
    .filter((c) => getFieldProp("filter", getFieldType(c)))
    .map((c) => ({
      value: c.key,
      label: c.name,
      type: c.type,
      key: c.key,
      index: c.index,
    }));

  // State for filter inputs
  const [query, setQuery] = useState<TableFilter | typeof INITIAL_QUERY>(
    defaultQuery || INITIAL_QUERY
  );
  const resetQuery = () => setQuery(INITIAL_QUERY);

  // When the user sets a new column, automatically set the operator and value
  const handleChangeColumn = (value: string | null) => {
    const column = find(filterColumns, ["key", value]);

    if (column) {
      const filter = getFieldProp("filter", getFieldType(column));
      setQuery({
        key: column.key,
        operator: filter.operators[0].value,
        value: filter.defaultValue ?? "",
      });
    } else {
      setQuery(INITIAL_QUERY);
    }
  };

  // Get the column config
  const selectedColumn = find(filterColumns, ["key", query?.key]);
  // Get available filters from selected column type
  const availableFilters: IFieldConfig["filter"] = selectedColumn
    ? getFieldProp("filter", getFieldType(selectedColumn))
    : undefined;

  return {
    filterColumns,
    selectedColumn,
    handleChangeColumn,
    availableFilters,
    query,
    setQuery,
    resetQuery,
  } as const;
};
