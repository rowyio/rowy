import { atom } from "jotai";
import {
  cloneDeep,
  find,
  get as _get,
  set as _set,
  isEqual,
  unset,
  filter,
} from "lodash-es";

import { currentUserAtom } from "@src/atoms/projectScope";
import {
  auditChangeAtom,
  tableSettingsAtom,
  tableColumnsOrderedAtom,
  tableFiltersAtom,
  tableRowsLocalAtom,
  tableRowsAtom,
  _updateRowDbAtom,
  _deleteRowDbAtom,
  _bulkWriteDbAtom,
} from "./table";

import { TableRow, BulkWriteFunction } from "@src/types/table";
import {
  rowyUser,
  generateId,
  decrementId,
  updateRowData,
  omitRowyFields,
} from "@src/utils/table";
import { arrayRemove, arrayUnion } from "firebase/firestore";

export interface IAddRowOptions {
  /** The row or array of rows to add */
  row: TableRow | TableRow[];
  /** If true, ignores checking required fields have values */
  ignoreRequiredFields?: boolean;
  /** Optionally overwite the IDs in the provided rows */
  setId?: "random" | "decrement";
}
/**
 * Set function adds a row or an array of rows.
 * Adds to rowsDb if it has no missing required fields, otherwise to rowsLocal.
 * @param options - {@link IAddRowOptions}
 *
 * @example Basic usage:
 * ```
 * const addRow = useSetAtom(addRowAtom, tableScope);
 * addRow({ row: [ {...}, ... ] });
 * ```
 */
export const addRowAtom = atom(
  null,
  async (get, set, { row, ignoreRequiredFields, setId }: IAddRowOptions) => {
    const updateRowDb = get(_updateRowDbAtom);
    if (!updateRowDb) throw new Error("Cannot write to database");
    const tableSettings = get(tableSettingsAtom);
    if (!tableSettings) throw new Error("Cannot read table settings");
    const currentUser = get(currentUserAtom);
    if (!currentUser) throw new Error("Cannot read current user");
    const auditChange = get(auditChangeAtom);
    const tableFilters = get(tableFiltersAtom);
    const tableColumnsOrdered = get(tableColumnsOrderedAtom);
    const tableRows = get(tableRowsAtom);

    const _addSingleRowAndAudit = async (row: TableRow) => {
      // Store initial values to be written
      const initialValues: TableRow = { _rowy_ref: row._rowy_ref };

      // Store tableFilters that mean this row should be out of order
      const outOfOrderFilters = new Set(
        tableFilters.map((filter) => filter.key)
      );
      // Set initial values based on table filters, so rowsDb will include this.
      // If we can set the value for a filter key, remove that key from outOfOrderFilters
      for (const filter of tableFilters) {
        if (filter.operator === "==") {
          initialValues[filter.key] = filter.value;
          outOfOrderFilters.delete(filter.key);
        } else if (filter.operator === "array-contains") {
          initialValues[filter.key] = [filter.value];
          outOfOrderFilters.delete(filter.key);
        }
      }

      // Set initial values based on default values
      for (const column of tableColumnsOrdered) {
        if (column.config?.defaultValue?.type === "static")
          initialValues[column.key] = column.config.defaultValue.value!;
        else if (column.config?.defaultValue?.type === "null")
          initialValues[column.key] = null;
      }

      // Write audit fields if not explicitly disabled
      if (tableSettings.audit !== false) {
        const auditValue = rowyUser(currentUser);
        initialValues[tableSettings.auditFieldCreatedBy || "_createdBy"] =
          auditValue;
        initialValues[tableSettings.auditFieldUpdatedBy || "_updatedBy"] =
          auditValue;
      }

      // Check for required fields
      const requiredFields = ignoreRequiredFields
        ? []
        : tableColumnsOrdered
            .filter((column) => column.config?.required)
            .map((column) => column.key);
      const missingRequiredFields = ignoreRequiredFields
        ? []
        : requiredFields.filter((field) => row[field] === undefined);

      // Combine initial values with row values
      const rowValues = { ...initialValues, ...row };

      // Add to rowsLocal (display on top, out of order) if:
      // - deliberately out of order
      // - there are filters set and we couldn’t set the value of a field to
      //   fit in the filtered query
      // - user did not set ID to decrement
      if (
        row._rowy_outOfOrder === true ||
        outOfOrderFilters.size > 0 ||
        setId !== "decrement"
      ) {
        set(tableRowsLocalAtom, {
          type: "add",
          row: { ...rowValues, _rowy_outOfOrder: true },
        });
      }

      // Also add to rowsLocal if any required fields are missing
      // (not out of order since those cases are handled above)
      else if (missingRequiredFields.length > 0) {
        set(tableRowsLocalAtom, {
          type: "add",
          row: { ...rowValues, _rowy_outOfOrder: false },
        });
      }

      // Write to database if no required fields are missing
      else {
        await updateRowDb(row._rowy_ref.path, omitRowyFields(rowValues));
      }

      if (auditChange) auditChange("ADD_ROW", row._rowy_ref.path);
    };

    // Find the first row in order to be used to decrement ID
    let firstInOrderRowId = tableRows[0]?._rowy_ref.id;
    for (const row of tableRows) {
      if (row._rowy_outOfOrder === false) {
        firstInOrderRowId = row._rowy_ref.id;
        break;
      }
    }

    if (Array.isArray(row)) {
      const promises: Promise<void>[] = [];

      let lastId = firstInOrderRowId;
      for (const r of row) {
        const id =
          setId === "random"
            ? generateId()
            : setId === "decrement"
            ? decrementId(lastId)
            : r._rowy_ref.id;
        lastId = id;

        const path = setId
          ? `${r._rowy_ref.path.split("/").slice(0, -1).join("/")}/${id}`
          : r._rowy_ref.path;

        promises.push(
          _addSingleRowAndAudit(setId ? { ...r, _rowy_ref: { id, path } } : r)
        );
      }

      await Promise.all(promises);
    } else {
      const id =
        setId === "random"
          ? generateId()
          : setId === "decrement"
          ? decrementId(firstInOrderRowId)
          : row._rowy_ref.id;

      const path = setId
        ? `${row._rowy_ref.path.split("/").slice(0, -1).join("/")}/${id}`
        : row._rowy_ref.path;

      await _addSingleRowAndAudit(
        setId ? { ...row, _rowy_ref: { id, path } } : row
      );
    }
  }
);

/**
 * Set function deletes a row or an array of rows from rowsDb or rowsLocal.
 * @param path - A single path or array of paths of rows to delete
 *
 * @example Basic usage:
 * ```
 * const deleteRow = useSetAtom(deleteRowAtom, tableScope);
 * deleteRow( path );
 * ```
 */
export const deleteRowAtom = atom(
  null,
  async (get, set, path: string | string[]) => {
    const deleteRowDb = get(_deleteRowDbAtom);
    if (!deleteRowDb) throw new Error("Cannot write to database");

    const auditChange = get(auditChangeAtom);
    const tableRowsLocal = get(tableRowsLocalAtom);

    const _deleteSingleRowAndAudit = async (path: string) => {
      const isLocalRow = Boolean(
        find(tableRowsLocal, ["_rowy_ref.path", path])
      );
      if (isLocalRow) set(tableRowsLocalAtom, { type: "delete", path });

      // Always delete from db in case it exists
      await deleteRowDb(path);
      if (auditChange) auditChange("DELETE_ROW", path);
    };

    if (Array.isArray(path)) {
      const promises = path.map(_deleteSingleRowAndAudit);
      await Promise.all(promises);
    } else {
      await _deleteSingleRowAndAudit(path);
    }
  }
);

export interface IBulkAddRowsOptions {
  rows: Partial<TableRow[]>;
  collection: string;
  onBatchCommit?: Parameters<BulkWriteFunction>[1];
}
export const bulkAddRowsAtom = atom(
  null,
  async (get, _, { rows, collection, onBatchCommit }: IBulkAddRowsOptions) => {
    const bulkWriteDb = get(_bulkWriteDbAtom);
    if (!bulkWriteDb) throw new Error("Cannot write to database");
    const tableSettings = get(tableSettingsAtom);
    if (!tableSettings) throw new Error("Cannot read table settings");
    const currentUser = get(currentUserAtom);
    if (!currentUser) throw new Error("Cannot read current user");
    const auditChange = get(auditChangeAtom);
    const tableColumnsOrdered = get(tableColumnsOrderedAtom);

    // Create initial values for all rows to be added
    const initialValues: Partial<TableRow> = {};

    // Set initial values based on default values
    for (const column of tableColumnsOrdered) {
      if (column.config?.defaultValue?.type === "static")
        initialValues[column.key] = column.config.defaultValue.value!;
      else if (column.config?.defaultValue?.type === "null")
        initialValues[column.key] = null;
    }

    // Write audit fields if not explicitly disabled
    if (tableSettings.audit !== false) {
      const auditValue = rowyUser(currentUser);
      initialValues[tableSettings.auditFieldCreatedBy || "_createdBy"] =
        auditValue;
      initialValues[tableSettings.auditFieldUpdatedBy || "_updatedBy"] =
        auditValue;
    }

    // Assign a random ID to each row
    const operations = rows.map((row) => ({
      type: row?._rowy_ref?.id ? ("update" as "update") : ("add" as "add"),
      path: `${collection}/${row?._rowy_ref?.id ?? generateId()}`,
      data: { ...initialValues, ...omitRowyFields(row) },
    }));

    // Write to db
    await bulkWriteDb(operations, onBatchCommit);

    // if (auditChange) {
    //   const auditChangePromises: Promise<void>[] = [];
    //   for (const operation of operations) {
    //     auditChangePromises.push(auditChange("ADD_ROW", operation.path));
    //   }
    //   await Promise.all(auditChangePromises);
    // }
  }
);

export interface IUpdateFieldOptions {
  /** The path to the row to update */
  path: string;
  /** The field name to update. Use dot notation to access nested fields. */
  fieldName: string;
  /** The value to write */
  value: any;
  /** Optionally, delete the field with fieldName. Use dot notation to access nested fields. */
  deleteField?: boolean;
  /** If true, ignores checking required fields have values */
  ignoreRequiredFields?: boolean;
  /** Optionally, disable checking if the updated value is equal to the current value. By default, we skip the update if they’re equal. */
  disableCheckEquality?: boolean;
  /** Optionally, uses firestore's arrayUnion with the given value. Appends given value items to the existing array */
  useArrayUnion?: boolean;
  /** Optionally, uses firestore's arrayRemove with the given value. Removes given value items from the existing array */
  useArrayRemove?: boolean;
}
/**
 * Set function updates or deletes a field in a row.
 * Adds to rowsDb if it has no missing required fields,
 * otherwise keeps in rowsLocal.
 * @param options - {@link IUpdateFieldOptions}
 *
 * @example Basic usage:
 * ```
 * const updateField = useSetAtom(updateFieldAtom, tableScope);
 * updateField({ path, fieldName: "", value: null, deleteField: true });
 * ```
 */
export const updateFieldAtom = atom(
  null,
  async (
    get,
    set,
    {
      path,
      fieldName,
      value,
      deleteField,
      ignoreRequiredFields,
      disableCheckEquality,
      useArrayUnion,
      useArrayRemove,
    }: IUpdateFieldOptions
  ) => {
    const updateRowDb = get(_updateRowDbAtom);
    if (!updateRowDb) throw new Error("Cannot write to database");
    const tableSettings = get(tableSettingsAtom);
    if (!tableSettings) throw new Error("Cannot read table settings");
    const currentUser = get(currentUserAtom);
    if (!currentUser) throw new Error("Cannot read current user");
    const auditChange = get(auditChangeAtom);
    const tableColumnsOrdered = get(tableColumnsOrderedAtom);
    const tableRows = get(tableRowsAtom);
    const tableRowsLocal = get(tableRowsLocalAtom);

    const row = find(tableRows, ["_rowy_ref.path", path]);
    if (!row) throw new Error("Could not find row");
    const isLocalRow = Boolean(find(tableRowsLocal, ["_rowy_ref.path", path]));

    const update: Partial<TableRow> = {};

    // Write audit fields if not explicitly disabled
    if (tableSettings.audit !== false) {
      const auditValue = rowyUser(currentUser);
      update[tableSettings.auditFieldUpdatedBy || "_updatedBy"] = auditValue;
    }

    // Apply field update
    if (!deleteField) {
      // Check for equality. If updated value is same as current, skip update
      if (!disableCheckEquality) {
        const currentValue = _get(row, fieldName);
        if (isEqual(currentValue, value)) return;
      }
      // Otherwise, apply the update
      _set(update, fieldName, value);
    }

    const localUpdate = cloneDeep(update);
    const dbUpdate = cloneDeep(update);
    // apply arrayUnion
    if (useArrayUnion) {
      if (!Array.isArray(update[fieldName]))
        throw new Error("Field must be an array");

      // use basic array merge on local row value
      localUpdate[fieldName] = [
        ...(row[fieldName] ?? []),
        ...localUpdate[fieldName],
      ];
      dbUpdate[fieldName] = arrayUnion(...dbUpdate[fieldName]);
    }

    //apply arrayRemove
    if (useArrayRemove) {
      if (!Array.isArray(update[fieldName]))
        throw new Error("Field must be an array");

      // use basic array filter on local row value
      localUpdate[fieldName] = filter(
        row[fieldName] ?? [],
        (el) => !find(localUpdate[fieldName], el)
      );
      dbUpdate[fieldName] = arrayRemove(...dbUpdate[fieldName]);
    }

    // Check for required fields
    const newRowValues = updateRowData(cloneDeep(row), dbUpdate);
    const requiredFields = ignoreRequiredFields
      ? []
      : tableColumnsOrdered
          .filter((column) => column.config?.required)
          .map((column) => column.key);
    const missingRequiredFields = ignoreRequiredFields
      ? []
      : requiredFields.filter((field) => newRowValues[field] === undefined);

    // If it’s a local row, update the row in rowsLocal
    if (isLocalRow) {
      set(tableRowsLocalAtom, {
        type: "update",
        path,
        row: localUpdate,
        deleteFields: deleteField ? [fieldName] : [],
      });

      // If it has no missingRequiredFields, also write to db
      // And write entire row to handle the case where it doesn’t exist in db yet
      if (missingRequiredFields.length === 0) {
        if (deleteField) unset(newRowValues, fieldName);

        await updateRowDb(
          row._rowy_ref.path,
          omitRowyFields(newRowValues),
          deleteField ? [fieldName] : []
        );
      }
    }
    // Otherwise, update single field in database and write audit update field
    else {
      await updateRowDb(
        row._rowy_ref.path,
        omitRowyFields(dbUpdate),
        deleteField ? [fieldName] : []
      );
    }

    if (auditChange)
      auditChange("UPDATE_CELL", path, { updatedField: fieldName });
  }
);
