import React, { useState } from "react";
import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import { useConfirmation } from "components/ConfirmationDialog";

import { DialogContentText, Chip } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import TableHeaderButton from "./TableHeaderButton";
import SparkIcon from "@material-ui/icons/OfflineBolt";

import Modal from "components/Modal";
import CodeEditor from "../editors/CodeEditor";

// import { SnackContext } from "contexts/SnackContext";
import { useFiretableContext } from "contexts/FiretableContext";
import { triggerCloudBuild } from "firebase/callables";

export default function SparksEditor() {
  const { tableState, tableActions } = useFiretableContext();

  // const snackContext = useContext(SnackContext);
  const { requestConfirmation } = useConfirmation();

  const currentSparks = tableState?.config.sparks ?? "";
  const [localSparks, setLocalSparks] = useState(currentSparks);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    if (currentSparks !== localSparks) {
      requestConfirmation({
        title: "Discard Changes",
        body: "You will lose changes you have made to this spark",
        confirm: "Discard",
        handleConfirm: () => {
          setOpen(false);
          setLocalSparks(currentSparks);
        },
      });
    } else setOpen(false);
  };

  const handleSave = () => {
    tableActions?.table.updateConfig("sparks", localSparks);
    setOpen(false);
    requestConfirmation({
      title: "Deploy Changes",
      body: "Would you like to redeploy the cloud function for this table now?",
      confirm: "Deploy",
      cancel: "later",
      handleConfirm: async () => {
        const response = await triggerCloudBuild(
          tableState?.config.tableConfig.path
        );
        console.log(response);
      },
    });
  };
  // const cloudBuild = tableState?.config.tableConfig.doc.cloudBuild;
  return (
    <>
      <TableHeaderButton
        title="Edit Sparks (ALPHA)"
        onClick={() => setOpen(true)}
        icon={<SparkIcon />}
      />

      {open && !!tableState && (
        <Modal
          onClose={handleClose}
          maxWidth="xl"
          fullWidth
          title={
            <>
              Edit “{tableState?.tablePath}” Sparks{" "}
              <Chip label="ALPHA" size="small" />
            </>
          }
          children={
            <>
              <Alert severity="warning">
                This is an alpha feature. Cloud Functions and Google Cloud
                integration setup is required, but the process is not yet
                finalised.
              </Alert>

              <DialogContentText>
                Write your Sparks configuration below. Each Spark will be
                evaluated and executed by Cloud Firestore <code>onWrite</code>{" "}
                triggers on rows in this table.
              </DialogContentText>

              <CodeEditor
                script={currentSparks}
                handleChange={(newValue) => {
                  setLocalSparks(newValue);
                }}
              />
            </>
          }
          actions={{
            primary: {
              children: "Save Changes",
              onClick: handleSave,
              disabled: localSparks === tableState?.config.sparks,
            },
            secondary: {
              children: "Cancel",
              onClick: handleClose,
            },
          }}
        />
      )}
    </>
  );
}
