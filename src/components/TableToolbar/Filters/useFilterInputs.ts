import { useState } from "react";
import { find } from "lodash-es";

import { getFieldType, getFieldProp } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import type { ColumnConfig, TableFilter } from "@src/types/table";
import type { IFieldConfig } from "@src/components/fields/types";
import { generateId } from "@src/utils/table";

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
      config: c.config || {},
    }));

  // Always allow IDs to be filterable
  filterColumns.push({
    value: "_rowy_ref.id",
    label: "Document ID",
    type: FieldType.id,
    key: "_rowy_ref.id",
    index: filterColumns.length,
    config: {},
  });

  const INITIAL_QUERY: TableFilter[] =
    filterColumns && filterColumns.length > 0
      ? [
          {
            key: filterColumns[0].key,
            operator:
              filterColumns[0].key === "_rowy_ref.id"
                ? "id-equal"
                : getFieldProp("filter", getFieldType(filterColumns[0]))
                    .operators[0].value,
            value:
              filterColumns[0].key === "_rowy_ref.id"
                ? ""
                : getFieldProp("filter", getFieldType(filterColumns[0]))
                    .defaultValue ?? "",
            id: generateId(),
          },
        ]
      : [];

  // State for filter inputs
  const [queries, setQueries] = useState<TableFilter[]>(
    defaultQuery ? [{ ...defaultQuery, id: generateId() }] : INITIAL_QUERY
  );
  const resetQuery = () => setQueries([]);

  // State for filter inputs joined by AND/OR
  const [joinOperator, setJoinOperator] = useState<"AND" | "OR">("AND");

  // When the user sets a new column, automatically set the operator and value
  const handleColumnChange = (oldId: string, newKey: string) => {
    if (newKey === "_rowy_ref.id") {
      setQueries((prevQueries) => {
        return prevQueries.map((q) => {
          if (q.id === oldId)
            return {
              key: newKey,
              operator: "id-equal",
              value: "",
              id: q.id,
            };

          return q;
        });
      });

      return;
    }

    const column = find(filterColumns, ["key", newKey]);
    if (column) {
      const filter = getFieldProp("filter", getFieldType(column));
      setQueries((prevQueries) => {
        return prevQueries.map((q) => {
          if (q.id === oldId)
            return {
              key: newKey,
              operator: filter.operators[0].value,
              value: filter.defaultValue ?? "",
              id: q.id,
            };

          return q;
        });
      });
    } else {
      setQueries((prevQueries) => {
        return prevQueries.map((q) => {
          if (q.id === oldId)
            return {
              key: newKey,
              operator: "is-not-empty",
              value: "",
              id: q.id,
            };

          return q;
        });
      });
    }
  };

  // Get the column config
  const selectedColumns = [];
  for (const query of queries) {
    const column = find(filterColumns, ["key", query.key]);
    if (column) selectedColumns.push(column);
  }

  const availableFiltersForEachSelectedColumn: IFieldConfig["filter"][] =
    selectedColumns.map((column) => {
      if (column.key === "_rowy_ref.id") {
        return { operators: [{ value: "id-equal", label: "is" }] };
      }
      return getFieldProp("filter", getFieldType(column));
    });

  return {
    filterColumns,
    selectedColumns,
    handleColumnChange,
    availableFiltersForEachSelectedColumn,
    queries,
    setQueries,
    resetQuery,
    joinOperator,
    setJoinOperator,
  } as const;
};
