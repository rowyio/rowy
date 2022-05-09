import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { DialogProps, ButtonProps } from "@mui/material";
import { TableSettings, TableSchema } from "@src/types/table";
import { getTableSchemaAtom } from "./project";

/** Nav open state stored in local storage. */
export const navOpenAtom = atomWithStorage("__ROWY__NAV_OPEN", false);
/** Nav pinned state stored in local storage. */
export const navPinnedAtom = atomWithStorage("__ROWY__NAV_PINNED", false);

/** View for tables page */
export const tablesViewAtom = atomWithStorage<"grid" | "list">(
  "__ROWY__HOME_VIEW",
  "grid"
);

export type ConfirmDialogProps = {
  open: boolean;

  title?: string;
  /** Pass a string to display basic styled text */
  body?: React.ReactNode;

  /** Callback called when user clicks confirm */
  handleConfirm?: () => void;
  /** Optionally override confirm button text */
  confirm?: string | JSX.Element;
  /** Optionally require user to type this string to enable the confirm button */
  confirmationCommand?: string;
  /** Optionally set confirm button color */
  confirmColor?: ButtonProps["color"];

  /** Callback called when user clicks cancel */
  handleCancel?: () => void;
  /** Optionally override cancel button text */
  cancel?: string;
  /** Optionally hide cancel button */
  hideCancel?: boolean;

  /** Optionally set dialog max width */
  maxWidth?: DialogProps["maxWidth"];
};
/**
 * Open a confirm dialog
 *
 * @example Basic usage:
 * ```
 * const confirm = useSetAtom(confirmDialogAtom, globalScope);
 * confirm({ handleConfirm: () => ... });
 * ```
 */
export const confirmDialogAtom = atom(
  { open: false } as ConfirmDialogProps,
  (get, set, update: Partial<ConfirmDialogProps>) => {
    set(confirmDialogAtom, {
      ...get(confirmDialogAtom),
      open: true, // Don’t require this to be set explicitly
      ...update,
    });
  }
);

export type RowyRunModalState = {
  open: boolean;
  feature: string;
  version: string;
};
/**
 * Open global Rowy Run modal if feature not available.
 * Calling the set function resets props.
 *
 * @example Basic usage:
 * ```
 * const openRowyRunModal = useSetAtom(rowyRunModalAtom, globalScope);
 * openRowyRunModal({ feature: ... , version: ... });
 * ```
 *
 * @example Close dialog:
 * ```
 * openRowyRunModal({ open: false })
 * ```
 */
export const rowyRunModalAtom = atom(
  { open: false, feature: "", version: "" } as RowyRunModalState,
  (_, set, update?: Partial<RowyRunModalState>) => {
    set(rowyRunModalAtom, {
      open: true,
      feature: "",
      version: "",
      ...update,
    });
  }
);

export type TableSettingsDialogState = {
  open: boolean;
  mode: "create" | "update";
  data: TableSettings | null;
};
/**
 * Open table settings dialog.
 * Calling the set function resets props.
 *
 * @example Basic usage:
 * ```
 * const openTableSettingsDialog = useSetAtom(tableSettingsDialogAtom, globalScope);
 * openTableSettingsDialog({ data: ... });
 * ```
 *
 * @example Clear dialog:
 * ```
 * openTableSettingsDialog({ open: false })
 * ```
 */
export const tableSettingsDialogAtom = atom(
  { open: false, mode: "create", data: null } as TableSettingsDialogState,
  (_, set, update?: Partial<TableSettingsDialogState>) => {
    set(tableSettingsDialogAtom, {
      open: true,
      mode: "create",
      data: null,
      ...update,
    });
  }
);

export const tableSettingsDialogIdAtom = atom("");
export const tableSettingsDialogSchemaAtom = atom(async (get) => {
  const tableId = get(tableSettingsDialogIdAtom);
  const getTableSchema = get(getTableSchemaAtom);
  if (!tableId || !getTableSchema) return {} as TableSchema;
  return getTableSchema(tableId);
});
