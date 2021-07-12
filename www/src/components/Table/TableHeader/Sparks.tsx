import { useState } from "react";
import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import { useConfirmation } from "components/ConfirmationDialog";
import { useSnackContext } from "contexts/SnackContext";
import { db } from "../../../firebase";

import { DialogContentText, Chip } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import TableHeaderButton from "./TableHeaderButton";
import SparkIcon from "@material-ui/icons/OfflineBolt";
import Modal from "components/Modal";
import { useFiretableContext } from "contexts/FiretableContext";
import { useAppContext } from "contexts/AppContext";
import { useSnackLogContext } from "contexts/SnackLogContext";
import CodeEditor from "../editors/CodeEditor";
import WIKI_LINKS from "constants/wikiLinks";

export default function SparksEditor() {
  const snack = useSnackContext();
  const { tableState, tableActions } = useFiretableContext();
  const appContext = useAppContext();
  const { requestConfirmation } = useConfirmation();
  const currentSparks = tableState?.config.sparks ?? "";
  const [localSparks, setLocalSparks] = useState(currentSparks);
  const [open, setOpen] = useState(false);
  const [isSparksValid, setIsSparksValid] = useState(true);
  const [showForceSave, setShowForceSave] = useState(false);
  const snackLogContext = useSnackLogContext();

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
        const settingsDoc = await db.doc("/_FIRETABLE_/settings").get();
        const ftBuildUrl = settingsDoc.get("ftBuildUrl");
        if (!ftBuildUrl) {
          snack.open({
            message: `Cloud Run trigger URL not configured. Configuration guide: ${WIKI_LINKS.cloudRunFtBuilder}`,
            variant: "error",
          });
        }

        const userTokenInfo = await appContext?.currentUser?.getIdTokenResult();
        const userToken = userTokenInfo?.token;
        try {
          snackLogContext.requestSnackLog();
          const response = await fetch(ftBuildUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              configPath: tableState?.config.tableConfig.path,
              token: userToken,
            }),
          });
          const data = await response.json();
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  const handleKeyChange = (key) => {
    setShowForceSave(key.shiftKey && key.ctrlKey);
  };

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
              Edit “
              {tableState?.tablePath
                ?.split("/")
                .filter(function (_, i) {
                  // replace IDs with dash that appears at even indexes
                  return i % 2 === 0;
                })
                .join("-")}
              ” Sparks <Chip label="ALPHA" size="small" />
            </>
          }
          children={
            <div style={{ height: "calc(100vh - 250px)" }}>
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
                height="100%"
                handleChange={(newValue) => {
                  setLocalSparks(newValue);
                }}
                onValideStatusUpdate={({ isValid }) => {
                  setIsSparksValid(isValid);
                }}
                diagnosticsOptions={{
                  noSemanticValidation: false,
                  noSyntaxValidation: false,
                  noSuggestionDiagnostics: true,
                }}
              />
              {!isSparksValid && (
                <Alert severity="error">
                  You need to resolve all errors before you are able to save. Or
                  press shift and control key to enable force save.
                </Alert>
              )}
            </div>
          }
          actions={{
            primary: showForceSave
              ? {
                  children: "Force Save",
                  onClick: handleSave,
                }
              : {
                  children: "Save Changes",
                  onClick: handleSave,
                  disabled:
                    !isSparksValid || localSparks === tableState?.config.sparks,
                },
            secondary: {
              children: "Cancel",
              onClick: handleClose,
            },
          }}
          onKeyDown={handleKeyChange}
          onKeyUp={handleKeyChange}
        />
      )}
    </>
  );
}
