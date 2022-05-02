import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { DialogProps, ButtonProps } from "@mui/material";

/** Nav open state stored in local storage. */
export const navOpenAtom = atomWithStorage("__ROWY__NAV_OPEN", false);
/** Nav pinned state stored in local storage. */
export const navPinnedAtom = atomWithStorage("__ROWY__NAV_PINNED", false);

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
 * confirm({
 *   open: true,
 *   handleConfirm: () => ...
 * });
 * ```
 */
export const confirmDialogAtom = atom<ConfirmDialogProps>({ open: false });

/**
 * Open global Rowy Run modal if feature not available
 * {@link openRowyRunModalAtom | Use `openRowyRunModalAtom` to open}
 */
export const rowyRunModalAtom = atom({ open: false, feature: "", version: "" });
/**
 * Helper atom to open Rowy Run Modal
 *
 * @example Basic usage:
 * ```
 * const openRowyRun = useSetAtom(openRowyRunModalAtom, globalScope);
 * openRowyRun({
 *   feature: ...
 *   version: ...
 * });
 * ```
 */
export const openRowyRunModalAtom = atom(
  null,
  (_, set, update?: Partial<Record<"feature" | "version", string>>) => {
    set(rowyRunModalAtom, {
      open: true,
      feature: update?.feature || "",
      version: update?.version || "",
    });
  }
);
