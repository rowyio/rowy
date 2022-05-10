import { atom } from "jotai";
import { uniqBy, orderBy, findIndex } from "lodash-es";

import {
  TableSettings,
  TableSchema,
  TableFilter,
  TableOrder,
  TableRow,
  ColumnConfig,
} from "@src/types/table";

/** Root atom from which others are derived */
export const tableIdAtom = atom<string | undefined>(undefined);
/** Store tableSettings from project settings document */
export const tableSettingsAtom = atom<TableSettings | undefined>(undefined);
/** Store tableSchema from schema document */
export const tableSchemaAtom = atom<TableSchema | undefined>(undefined);
/** Store function to update tableSchema */
export const updateTableSchemaAtom = atom<
  ((update: Partial<TableSchema>) => Promise<void>) | undefined
>(undefined);
/** Store the table columns as an ordered array */
export const tableColumnsOrderedAtom = atom<ColumnConfig[]>((get) => {
  const tableSchema = get(tableSchemaAtom);
  if (!tableSchema || !tableSchema.columns) return [];
  return orderBy(Object.values(tableSchema?.columns ?? {}), "index");
});
/** Reducer function to convert from array of columns to columns object */
export const tableColumnsReducer = (
  a: Record<string, ColumnConfig>,
  c: ColumnConfig,
  index: number
) => {
  a[c.key] = { ...c, index };
  return a;
};

/**
 * Store function to add a column to tableSchema, to the end or by index.
 * Also fixes any issues with column indexes, so they go from 0 to length - 1
 * @param config - Column config to add. `config.index` is ignored
 * @param index - Index to add column at. If undefined, adds to end
 */
export const addColumnAtom = atom((get) => {
  const tableColumnsOrdered = [...get(tableColumnsOrderedAtom)];
  const updateTableSchema = get(updateTableSchemaAtom);
  if (!updateTableSchema) {
    return async (config: ColumnConfig, index?: number) => {
      throw new Error("Cannot update table schema");
    };
  }

  return (config: Omit<ColumnConfig, "index">, index?: number) => {
    // If index is provided, insert at index. Otherwise, append to end
    tableColumnsOrdered.splice(index ?? tableColumnsOrdered.length, 0, {
      ...config,
      index: index ?? tableColumnsOrdered.length,
    } as ColumnConfig);

    // Reduce array into single object with updated indexes
    const updatedColumns = tableColumnsOrdered.reduce(tableColumnsReducer, {});
    return updateTableSchema({ columns: updatedColumns });
  };
});

/**
 * Store function to update a column in tableSchema. If not found, throws error.
 * @param key - Unique key of column to update
 * @param config - Partial column config to add. `config.index` is ignored
 * @param index - If passed, reorders the column to the index
 */
export const updateColumnAtom = atom((get) => {
  const tableColumnsOrdered = [...get(tableColumnsOrderedAtom)];
  const updateTableSchema = get(updateTableSchemaAtom);
  if (!updateTableSchema) {
    return async (key: string, config: Partial<ColumnConfig>) => {
      throw new Error("Cannot update table schema");
    };
  }

  return (key: string, config: Partial<ColumnConfig>, index?: number) => {
    const currentIndex = findIndex(tableColumnsOrdered, ["key", key]);
    if (currentIndex === -1)
      throw new Error(`Column with key "${key}" not found`);

    // If column is not being reordered, just update the config
    if (!index) {
      tableColumnsOrdered[currentIndex] = {
        ...tableColumnsOrdered[currentIndex],
        ...config,
        index: currentIndex,
      };
    }
    // Otherwise, remove the column from the current position
    // Then insert it at the new position
    else {
      const currentColumn = tableColumnsOrdered.splice(currentIndex, 1)[0];
      tableColumnsOrdered.splice(index, 0, {
        ...currentColumn,
        ...config,
        index,
      });
    }

    // Reduce array into single object with updated indexes
    const updatedColumns = tableColumnsOrdered.reduce(tableColumnsReducer, {});
    return updateTableSchema({ columns: updatedColumns });
  };
});

/**
 * Store function to delete a column in tableSchema
 * @param key - Unique key of column to delete
 */
export const deleteColumnAtom = atom((get) => {
  const tableColumnsOrdered = [...get(tableColumnsOrderedAtom)];
  const updateTableSchema = get(updateTableSchemaAtom);
  if (!updateTableSchema) {
    return async (key: string) => {
      throw new Error("Cannot update table schema");
    };
  }

  return (key: string) => {
    const updatedColumns = tableColumnsOrdered
      .filter((c) => c.key !== key)
      .reduce(tableColumnsReducer, {});

    return updateTableSchema({ columns: updatedColumns });
  };
});

/** Filters applied to the local view */
export const tableFiltersAtom = atom<TableFilter[]>([]);
/** Orders applied to the local view */
export const tableOrdersAtom = atom<TableOrder[]>([]);
/** Latest page in the infinite scroll */
export const tablePageAtom = atom(0);

/** Store rows that are out of order or not ready to be written to the db */
export const tableRowsLocalAtom = atom<TableRow[]>([]);
/** Store rows from the db listener */
export const tableRowsDbAtom = atom<TableRow[]>([]);
/** Combine tableRowsLocal and tableRowsDb */
export const tableRowsAtom = atom<TableRow[]>((get) =>
  uniqBy(
    [...get(tableRowsLocalAtom), ...get(tableRowsDbAtom)],
    "_rowy_ref.path"
  )
);
/** Store loading more state for infinite scroll */
export const tableLoadingMoreAtom = atom(false);
