import { atom } from "jotai";
import { atomWithStorage, atomWithHash } from "jotai/utils";

import type { PopoverProps } from "@mui/material";
import type { ColumnConfig, TableFilter } from "@src/types/table";
import { SEVERITY_LEVELS } from "@src/components/TableToolbar/CloudLogs/CloudLogSeverityIcon";

/**
 * Open table column menu. Set to `null` to close.
 *
 * @example Basic usage:
 * ```
 * const openColumnMenu = useSetAtom(columnMenuAtom, globalScope);
 * openColumnMenu({ column, anchorEl: ... });
 * ```
 *
 * @example Close:
 * ```
 * openColumnMenu(null)
 * ```
 */
export const columnMenuAtom = atom<{
  column: ColumnConfig;
  anchorEl: PopoverProps["anchorEl"];
} | null>(null);

/**
 * Opens a table column modal. Set to `null` to close.
 * Modals: new column, name change, type change, column settings.
 *
 * @example Basic usage:
 * ```
 * const openColumnModal = useSetAtom(columnModalAtom, globalScope);
 * openColumnModal({ type: "...", column });
 * ```
 *
 * @example Close:
 * ```
 * import { RESET } from "jotai/utils";
 * openColumnModal(RESET)
 * ```
 */
export const columnModalAtom = atomWithHash<{
  type: "new" | "name" | "type" | "config";
  columnKey?: string;
  index?: number;
} | null>("columnModal", null, { replaceState: true });

export type TableFiltersPopoverState = {
  open: boolean;
  defaultQuery?: TableFilter;
};
/**
 * Store table filter popover state.
 * Calling the set function resets props.
 *
 * @example Basic usage:
 * ```
 * const openTableFiltersPopover = useSetAtom(tableFiltersPopoverAtom, globalScope);
 * openTableFiltersPopover({ query: ... });
 * ```
 *
 * @example Close:
 * ```
 * openTableFiltersPopover({ open: false })
 * ```
 */
export const tableFiltersPopoverAtom = atom(
  { open: false } as TableFiltersPopoverState,
  (_, set, update?: Partial<TableFiltersPopoverState>) => {
    set(tableFiltersPopoverAtom, { open: true, ...update });
  }
);

/** Store whether to show hidden fields (override) in side drawer */
export const sideDrawerShowHiddenFieldsAtom = atomWithStorage(
  "__ROWY__SIDE_DRAWER_SHOW_HIDDEN_FIELDS",
  false
);

/**
 * Opens a table modal. Set to `null` to close.
 * Modals: cloud logs, extensions, webhooks, export.
 *
 * @example Basic usage:
 * ```
 * const openTableModal = useSetAtom(tableModalAtom, globalScope);
 * openTableModal("...");
 * ```
 *
 * @example Close:
 * ```
 * openTableModal(null)
 * ```
 */
export const tableModalAtom = atomWithHash<
  "cloudLogs" | "extensions" | "webhooks" | "export" | null
>("tableModal", null, { replaceState: true });

/** Store side drawer open state */
export const sideDrawerOpenAtom = atom(false);

/** Store selected cell in table */
export const selectedCellAtom = atom<{
  path: string;
  columnKey: string;
} | null>(null);

export type CloudLogFilters = {
  type: "webhook" | "functions" | "audit" | "build";
  timeRange:
    | { type: "seconds" | "minutes" | "hours" | "days"; value: number }
    | { type: "range"; start: Date; end: Date };
  severity?: Array<keyof typeof SEVERITY_LEVELS>;
  webhook?: string[];
  auditRowId?: string;
  buildLogExpanded?: number;
};
/** Store cloud log modal filters in URL */
export const cloudLogFiltersAtom = atomWithHash<CloudLogFilters>(
  "cloudLogFilters",
  {
    type: "build",
    timeRange: { type: "days", value: 7 },
  }
);
