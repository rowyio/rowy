import { atom } from "jotai";
import { find } from "lodash-es";

import { currentUserAtom } from "@src/atoms/globalScope";
import {
  auditChangeAtom,
  tableSettingsAtom,
  tableFiltersAtom,
  tableRowsLocalAtom,
  _updateRowDbAtom,
  _deleteRowDbAtom,
} from "./table";
import { tableColumnsOrderedAtom } from "./columnActions";
import { TableRow } from "@src/types/table";
import { rowyUser } from "@src/utils/table";

export interface IAddRowOptions {
  row: TableRow | TableRow[];
  ignoreRequiredFields?: boolean;
}

/**
 * Adds a row or an array of rows.
 * Adds to rowsDb if it has no missing required fields,
 * otherwise to or rowsLocal.
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
  async (get, set, { row, ignoreRequiredFields }: IAddRowOptions) => {
    const updateRowDb = get(_updateRowDbAtom);
    if (!updateRowDb) throw new Error("Cannot write to database");
    const tableSettings = get(tableSettingsAtom);
    if (!tableSettings) throw new Error("Cannot read table settings");
    const currentUser = get(currentUserAtom);
    if (!currentUser) throw new Error("Cannot read current user");
    const auditChange = get(auditChangeAtom);
    const tableFilters = get(tableFiltersAtom);
    const tableColumnsOrdered = get(tableColumnsOrderedAtom);

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

      // Add to rowsLocal if any required fields are missing or
      // deliberately out of order
      if (
        missingRequiredFields.length > 0 ||
        row._rowy_outOfOrder === true ||
        outOfOrderFilters.size > 0
      ) {
        set(tableRowsLocalAtom, {
          type: "add",
          row: { ...rowValues, _rowy_outOfOrder: true },
        });
      } else {
        await updateRowDb(row._rowy_ref.path, rowValues);
      }

      if (auditChange) auditChange("ADD_ROW", row._rowy_ref.path);
    };

    if (Array.isArray(row)) {
      const promises = row.map(_addSingleRowAndAudit);
      await Promise.all(promises);
    } else {
      await _addSingleRowAndAudit(row);
    }
  }
);

/**
 * Deletes a row or an array of rows from rowsDb or rowsLocal.
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
    const rowsLocal = get(tableRowsLocalAtom);

    const _deleteSingleRowAndAudit = async (path: string) => {
      const isLocalRow = Boolean(find(rowsLocal, ["_rowy_ref.path", path]));
      if (isLocalRow) set(tableRowsLocalAtom, { type: "delete", path });
      else await deleteRowDb(path);
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
