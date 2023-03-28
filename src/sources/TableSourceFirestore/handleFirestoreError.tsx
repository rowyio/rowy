import { FirestoreError } from "firebase/firestore";
import { useSnackbar } from "notistack";

import { Button } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

/**
 * Handles errors in Firestore listeners in the UI
 * @param error - FirestoreError
 * @param enqueueSnackbar - Displays snackbar error
 * @param elevateError - Displays error message in ErrorBoundary
 */
export const handleFirestoreError = (
  error: FirestoreError,
  enqueueSnackbar: ReturnType<typeof useSnackbar>["enqueueSnackbar"],
  elevateError: (error: FirestoreError) => void
) => {
  if (error.code === "permission-denied") {
    enqueueSnackbar("You do not have access to this table", {
      variant: "error",
    });
    return;
  }

  if (error.message.includes("indexes?create_composite=")) {
    enqueueSnackbar(
      "Filtering while having another column sorted requires a new Firestore index",
      {
        variant: "warning",
        action: (
          <Button
            variant="contained"
            color="secondary"
            href={"https" + error.message.split("https").pop()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Create index
            <InlineOpenInNewIcon style={{ lineHeight: "16px" }} />
          </Button>
        ),
      }
    );
    return;
  }

  if (error.message.includes("/firestore/indexes?")) {
    enqueueSnackbar(
      "Filtering on a group collection requires a new Firestore index",
      {
        variant: "warning",
        action: (
          <Button
            variant="contained"
            color="secondary"
            href={"https" + error.message.split("https").pop()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Create index
            <InlineOpenInNewIcon style={{ lineHeight: "16px" }} />
          </Button>
        ),
      }
    );
    return;
  }

  if (error.code === "invalid-argument") {
    enqueueSnackbar("Cannot sort by this column with the current set filters", {
      variant: "error",
    });
    return;
  }

  elevateError(error);
};
