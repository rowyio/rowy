import { useState } from "react";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";

import { TableState, TableFilter } from "@src/hooks/useTable";
import { getColumnType, getFieldProp } from "@src/components/fields";

export const INITIAL_QUERY = { key: "", operator: "", value: "" };

export const useFilterInputs = (columns: TableState["columns"]) => {
  // Get list of columns that can be filtered
  const filterColumns = _sortBy(Object.values(columns), "index")
    .filter((c) => getFieldProp("filter", getColumnType(c)))
    .map((c) => ({ value: c.key, label: c.name, ...c }));

  // State for filter inputs
  const [query, setQuery] = useState<TableFilter>(INITIAL_QUERY);
  const resetQuery = () => setQuery(INITIAL_QUERY);

  // When the user sets a new column, automatically set the operator and value
  const handleChangeColumn = (value: string | null) => {
    const column = _find(filterColumns, ["key", value]);

    if (column) {
      const filter = getFieldProp("filter", getColumnType(column));
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
  const selectedColumn = _find(filterColumns, ["key", query?.key]);
  // Get available filters from selected column type
  const availableFilters = selectedColumn
    ? getFieldProp("filter", getColumnType(selectedColumn))
    : null;

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
