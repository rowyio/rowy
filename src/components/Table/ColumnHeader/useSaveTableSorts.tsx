import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { SnackbarKey, useSnackbar } from "notistack";

import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";

import CircularProgressOptical from "@src/components/CircularProgressOptical";
import {
  tableIdAtom,
  tableScope,
  updateTableSchemaAtom,
} from "@src/atoms/tableScope";
import { projectScope, updateUserSettingsAtom } from "@src/atoms/projectScope";
import { TableSort } from "@src/types/table";

function useSaveTableSorts(canEditColumns: boolean) {
  const [updateTableSchema] = useAtom(updateTableSchemaAtom, tableScope);
  const [updateUserSettings] = useAtom(updateUserSettingsAtom, projectScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackbarId, setSnackbarId] = useState<SnackbarKey | null>(null);

  // Offer to save when table sorts changes
  const trigger = useCallback(
    (sorts: TableSort[]) => {
      if (!updateTableSchema) throw new Error("Cannot update table schema");
      if (updateUserSettings) {
        updateUserSettings({
          tables: {
            [`${tableId}`]: { sorts },
          },
        });
      }
      if (!canEditColumns) return;
      if (snackbarId) {
        closeSnackbar(snackbarId);
      }
      setSnackbarId(
        enqueueSnackbar("Apply this sorting for all users?", {
          action: (
            <SaveTableSortButton
              updateTable={async () => await updateTableSchema({ sorts })}
            />
          ),
          anchorOrigin: { horizontal: "center", vertical: "top" },
        })
      );

      return () => (snackbarId ? closeSnackbar(snackbarId) : null);
    },
    [
      updateUserSettings,
      canEditColumns,
      snackbarId,
      enqueueSnackbar,
      tableId,
      closeSnackbar,
      updateTableSchema,
    ]
  );

  return trigger;
}

function SaveTableSortButton({ updateTable }: { updateTable: Function }) {
  const [state, setState] = useState<"" | "loading" | "success" | "error">("");

  const handleSaveToSchema = async () => {
    setState("loading");
    try {
      await updateTable();
      setState("success");
    } catch (e) {
      setState("error");
    }
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

export default useSaveTableSorts;
