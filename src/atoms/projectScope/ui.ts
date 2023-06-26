import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { DialogProps, ButtonProps } from "@mui/material";
import type { TableSettings, TableSchema } from "@src/types/table";
import { getTableSchemaAtom } from "./project";

/**
 * Global state when the Alt key is pressed,
 * so we don’t set multiple event listeners
 */
export const altPressAtom = atom(false);

/** Nav open state stored in local storage. */
export const navOpenAtom = atomWithStorage("__ROWY__NAV_OPEN", false);

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
  /** Optionally set button layout */
  buttonLayout?: "horizontal" | "vertical";
};
/**
 * Open a confirm dialog
 *
 * @example Basic usage:
 * ```
 * const confirm = useSetAtom(confirmDialogAtom, projectScope);
 * confirm({ handleConfirm: () => ... });
 * ```
 */
export const confirmDialogAtom = atom(
  { open: false } as ConfirmDialogProps,
  (_, set, update: Partial<ConfirmDialogProps>) => {
    set(confirmDialogAtom, {
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
 * const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
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
 * const openTableSettingsDialog = useSetAtom(tableSettingsDialogAtom, projectScope);
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

export type ProjectSettingsDialogTab =
  | "general"
  | "rowy-run"
  | "services"
  | "secrets";
export type ProjectSettingsDialogState = {
  open: boolean;
  tab: ProjectSettingsDialogTab;
};
export const projectSettingsDialogAtom = atom(
  { open: false, tab: "secrets" } as ProjectSettingsDialogState,
  (_, set, update?: Partial<ProjectSettingsDialogState>) => {
    set(projectSettingsDialogAtom, {
      open: true,
      tab: "secrets",
      ...update,
    });
  }
);

/**
 * Store the current ID of the table being edited in tableSettingsDialog
 * to derive tableSettingsDialogSchemaAtom
 */
export const tableSettingsDialogIdAtom = atom("");
/** Get and store the schema document of the current table being edited */
export const tableSettingsDialogSchemaAtom = atom(async (get) => {
  const tableId = get(tableSettingsDialogIdAtom);
  const getTableSchema = get(getTableSchemaAtom);
  if (!tableId || !getTableSchema) return {} as TableSchema;
  return getTableSchema(tableId, true);
});

/** Open the Get Started checklist from anywhere */
export const getStartedChecklistAtom = atom(false);

/** Persist when the user dismissed the row out of order warning */
export const tableOutOfOrderDismissedAtom = atomWithStorage(
  "__ROWY__OUT_OF_ORDER_TOOLTIP_DISMISSED",
  false
);
/** Store tables where user has dismissed the description tooltip */
export const tableDescriptionDismissedAtom = atomWithStorage<string[]>(
  "__ROWY__TABLE_DESCRIPTION_DISMISSED",
  []
);

/** Store current JSON editor view */
export const jsonEditorAtom = atomWithStorage<"tree" | "code">(
  "__ROWY__JSON_EDITOR",
  "tree"
);
