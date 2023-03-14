import { useState } from "react";
import { find } from "lodash-es";

import { getFieldType, getFieldProp } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import type { ColumnConfig, TableFilter } from "@src/types/table";
import type { IFieldConfig } from "@src/components/fields/types";

export const INITIAL_QUERY = [{ key: "", operator: "", value: "" }];

export const useFilterInputs = (
  columns: ColumnConfig[],
  defaultQuery?: TableFilter[]
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

  // State for filter inputs
  const [query, setQuery] = useState<TableFilter[] | typeof INITIAL_QUERY>(
    defaultQuery || INITIAL_QUERY
  );
  const resetQuery = () => setQuery(INITIAL_QUERY);

  // When the user sets a new column, automatically set the operator and value
  const handleChangeColumn = (value: string | null, index: number) => {
    if (value === "_rowy_ref.id") {
      const updateQuery = [
        ...query,
        { key: "_rowy_ref.id", operator: "id-equal", value: "" },
      ];
      setQuery(updateQuery);
      return;
    }

    const column = find(filterColumns, ["key", value]);
    if (column) {
      const filter = getFieldProp("filter", getFieldType(column));
      if (index >= query.length) {
        // add new filter to back of list
        const updateQuery = [
          ...query,
          {
            key: column.key,
            operator: filter.operators[0].value,
            value: filter.defaultValue ?? "",
          },
        ];
        setQuery(updateQuery);
        console.log(updateQuery);
      } else {
        // replace existing filter
        const updateQuery = [...query];
        updateQuery[index] = {
          key: column.key,
          operator: filter.operators[0].value,
          value: filter.defaultValue ?? "",
        };
        setQuery(updateQuery);
      }
    } else {
      // no change
      setQuery(query || INITIAL_QUERY);
    }
  };

  const handleDeleteFilter = (index: number) => {
    let updateQuery = [...query];
    updateQuery.splice(index, 1);
    setQuery(updateQuery || INITIAL_QUERY);
  };

  // Get the column configs
  const selectedColumns = filterColumns.filter((col, idx) => {
    return col?.key === query[idx]?.key;
  });

  // Get available filters from selected column type(s)
  function getAvailableFilters(): IFieldConfig["filter"][] {
    var availFilters: IFieldConfig["filter"][] = new Array<
      IFieldConfig["filter"]
    >();
    query.forEach((i) => {
      if (i.key === "_rowy_ref.id") {
        availFilters.push({ operators: [{ value: "id-equal", label: "is" }] });
      }
    });
    selectedColumns.forEach((col) => {
      availFilters.push(getFieldProp("filter", getFieldType(col)));
    });
    return availFilters;
  }

  const availableFilters = getAvailableFilters();

  return {
    filterColumns,
    selectedColumn: selectedColumns,
    handleChangeColumn,
    handleDeleteFilter,
    availableFilters,
    query,
    setQuery,
    resetQuery,
  } as const;
};
