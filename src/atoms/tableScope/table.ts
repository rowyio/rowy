import { atom } from "jotai";
import { uniqBy } from "lodash-es";

import {
  TableSettings,
  TableSchema,
  TableFilter,
  TableOrder,
  TableRow,
  UpdateCollectionDocFunction,
  DeleteCollectionDocFunction,
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

/**
 * Store function to add or update row in db directly.
 * Has same behaviour as Firestore setDoc with merge.
 * See https://stackoverflow.com/a/47554197/3572007
 * @internal Use {@link addRowAtom} or {@link updateRowAtom} instead
 */
export const _updateRowDbAtom = atom<UpdateCollectionDocFunction | undefined>(
  undefined
);
/**
 * Store function to delete row in db directly
 * @internal Use {@link deleteRowAtom} instead
 */
export const _deleteRowDbAtom = atom<DeleteCollectionDocFunction | undefined>(
  undefined
);

export type AuditChangeFunction = (
  type: "ADD_ROW" | "UPDATE_CELL" | "DELETE_ROW",
  rowId: string,
  data?:
    | {
        updatedField?: string | undefined;
      }
    | undefined
) => Promise<any>;
/**
 * Store function to write auditing logs when user makes changes to the table.
 * Silently fails if auditing is disabled for the table or Rowy Run version
 * not compatible.
 *
 * @param type - Action type: "ADD_ROW" | "UPDATE_CELL" | "DELETE_ROW"
 * @param rowId - ID of row updated
 * @param data - Optional additional data to log
 */
export const auditChangeAtom = atom<AuditChangeFunction | undefined>(undefined);
