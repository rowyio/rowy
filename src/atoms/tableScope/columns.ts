import { atom } from "jotai";
import { orderBy, findIndex } from "lodash-es";

import { tableSchemaAtom, updateTableSchemaAtom } from "./table";
import { ColumnConfig } from "@src/types/table";

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

export interface IAddColumnOptions {
  /** Column config to add. `config.index` is ignored */
  config: Omit<ColumnConfig, "index">;
  /** Index to add column at. If undefined, adds to end */
  index?: number;
}
/**
 * Store function to add a column to tableSchema, to the end or by index.
 * Also fixes any issues with column indexes, so they go from 0 to length - 1
 * @param options - {@link IAddColumnOptions}
 *
 * @example Basic usage:
 * ```
 * const addColumn = useSetAtom(addColumnAtom, tableScope);
 * addColumn({ config: {...}, index?: 0 });
 * ```
 */
export const addColumnAtom = atom(
  null,
  async (get, _set, { config, index }: IAddColumnOptions) => {
    const tableColumnsOrdered = [...get(tableColumnsOrderedAtom)];
    const updateTableSchema = get(updateTableSchemaAtom);
    if (!updateTableSchema) throw new Error("Cannot update table schema");

    // If index is provided, insert at index. Otherwise, append to end
    tableColumnsOrdered.splice(index ?? tableColumnsOrdered.length, 0, {
      ...config,
      index: index ?? tableColumnsOrdered.length,
    } as ColumnConfig);

    // Reduce array into single object with updated indexes
    const updatedColumns = tableColumnsOrdered.reduce(tableColumnsReducer, {});
    await updateTableSchema({ columns: updatedColumns });
  }
);

export interface IUpdateColumnOptions {
  /** Unique key of column to update */
  key: string;
  /** Partial column config to add. `config.index` is ignored */
  config: Partial<ColumnConfig>;
  /** If passed, reorders the column to the index */
  index?: number;
}
/**
 * Store function to update a column in tableSchema
 * @throws Error if column not found
 * @param options - {@link IUpdateColumnOptions}
 *
 * @example Basic usage:
 * ```
 * const updateColumn = useSetAtom(updateColumnAtom, tableScope);
 * updateColumn({ key: "", config: {...}, index?: 0 });
 * ```
 */
export const updateColumnAtom = atom(
  null,
  async (get, _set, { key, config, index }: IUpdateColumnOptions) => {
    const tableColumnsOrdered = [...get(tableColumnsOrderedAtom)];
    const updateTableSchema = get(updateTableSchemaAtom);
    if (!updateTableSchema) throw new Error("Cannot update table schema");

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
    await updateTableSchema({ columns: updatedColumns });
  }
);

/**
 * Store function to delete a column in tableSchema
 * @param key - Unique key of column to delete
 *
 * @example Basic usage:
 * ```
 * const deleteColumn = useSetAtom(deleteColumnAtom, tableScope);
 * deleteColumn(" ... ");
 * ```
 */
export const deleteColumnAtom = atom(null, async (get, _set, key: string) => {
  const tableColumnsOrdered = [...get(tableColumnsOrderedAtom)];
  const updateTableSchema = get(updateTableSchemaAtom);
  if (!updateTableSchema) throw new Error("Cannot update table schema");

  const updatedColumns = tableColumnsOrdered
    .filter((c) => c.key !== key)
    .reduce(tableColumnsReducer, {});

  await updateTableSchema({ columns: updatedColumns });
});
