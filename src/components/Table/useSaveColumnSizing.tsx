import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useSnackbar } from "notistack";
import { useDebounce } from "use-debounce";
import { isEqual, isEmpty } from "lodash-es";

import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import {
  tableScope,
  updateColumnAtom,
  IUpdateColumnOptions,
} from "@src/atoms/tableScope";
import { DEBOUNCE_DELAY } from "./Table";
import { ColumnSizingState } from "@tanstack/react-table";

/** Debounces columnSizing and asks admins if they want to save for all users */
export function useSaveColumnSizing(
  columnSizing: ColumnSizingState,
  canEditColumns: boolean
) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const updateColumn = useSetAtom(updateColumnAtom, tableScope);

  // Debounce for saving to schema
  const [debouncedColumnSizing] = useDebounce(columnSizing, DEBOUNCE_DELAY, {
    equalityFn: isEqual,
  });
  // Offer to save when column sizing changes
  useEffect(() => {
    if (!canEditColumns || isEmpty(debouncedColumnSizing)) return;

    const snackbarId = enqueueSnackbar("Save column sizes for all users?", {
      action: (
        <SaveColumnSizingButton
          debouncedColumnSizing={debouncedColumnSizing}
          updateColumn={updateColumn}
        />
      ),
      anchorOrigin: { horizontal: "center", vertical: "top" },
    });

    return () => closeSnackbar(snackbarId);
  }, [
    debouncedColumnSizing,
    canEditColumns,
    enqueueSnackbar,
    closeSnackbar,
    updateColumn,
  ]);

  return null;
}

interface ISaveColumnSizingButtonProps {
  debouncedColumnSizing: ColumnSizingState;
  updateColumn: (update: IUpdateColumnOptions) => Promise<void>;
}

/**
 * Make the button a component so it can have its own state,
 * so we can display the loading state without showing a new snackbar
 */
function SaveColumnSizingButton({
  debouncedColumnSizing,
  updateColumn,
}: ISaveColumnSizingButtonProps) {
  const [state, setState] = useState<"" | "loading" | "success">("");

  const handleSaveToSchema = async () => {
    setState("loading");
    // Do this one by one for now to prevent race conditions.
    // Need to support updating multiple columns in updateColumnAtom
    // in the future.
    for (const [key, value] of Object.entries(debouncedColumnSizing)) {
      await updateColumn({ key, config: { width: value } });
    }
    setState("success");
  };

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      onClick={handleSaveToSchema}
      loading={Boolean(state)}
      loadingIndicator={
        state === "success" ? (
          <CheckIcon color="primary" />
        ) : (
          <CircularProgressOptical size={20} color="primary" />
        )
      }
    >
      Save
    </LoadingButton>
  );
}

export default useSaveColumnSizing;
