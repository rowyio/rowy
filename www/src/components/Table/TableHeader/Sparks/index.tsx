import React, { useState } from "react";
import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import { useConfirmation } from "components/ConfirmationDialog";
import { useSnackContext } from "contexts/SnackContext";
import { db } from "../../../../firebase";

import {
  DialogContentText,
  Chip,
  Breadcrumbs,
  Typography,
  Box,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import TableHeaderButton from "../TableHeaderButton";
import SparkIcon from "@material-ui/icons/OfflineBolt";
import Modal from "components/Modal";
import { useFiretableContext } from "contexts/FiretableContext";
import { useAppContext } from "contexts/AppContext";
import { useSnackLogContext } from "contexts/SnackLogContext";
import CodeEditor from "../../editors/CodeEditor";
import SparkList from "./SparkList";
import SparkModal from "./SparkModal";

import { parseSparkConfig, serialiseSpark, ISpark } from "./utils";

export default function SparksEditor() {
  const snack = useSnackContext();
  const { tableState, tableActions } = useFiretableContext();
  const appContext = useAppContext();
  const { requestConfirmation } = useConfirmation();
  const currentSparks = tableState?.config.sparks ?? "";
  const currentSparkObjects = (tableState?.config.sparkObjects ??
    []) as ISpark[];
  const [localSparks, setLocalSparks] = useState(currentSparks);
  const [open, setOpen] = useState(false);
  const [isSparksValid, setIsSparksValid] = useState(true);
  const [sparkModalOpen, setSparkModalOpen] = useState(false);
  const snackLogContext = useSnackLogContext();

  const tablePathTokens =
    tableState?.tablePath?.split("/").filter(function (_, i) {
      // replace IDs with dash that appears at even indexes
      return i % 2 === 0;
    }) ?? [];

  console.log("currentSparkObjects", currentSparkObjects);

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
            message:
              "Cloud Run trigger URL not configured. Configuration guide: https://github.com/AntlerVC/firetable/wiki/Setting-up-cloud-Run-FT-Builder",
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
          maxWidth="xs"
          fullWidth
          title={<>Sparks</>}
          children={
            <>
              <Breadcrumbs aria-label="breadcrumb">
                {tablePathTokens.map((pathToken, index) => {
                  console.log(pathToken);
                  return <Typography>{pathToken}</Typography>;
                })}
              </Breadcrumbs>
              <SparkList
                sparks={currentSparkObjects}
                handleAddSpark={() => {
                  setSparkModalOpen(true);
                }}
              />
            </>
          }
          actions={{
            primary: {
              children: "Save & Deploy",
              onClick: handleSave,
              disabled:
                !isSparksValid || localSparks === tableState?.config.sparks,
            },
            secondary: {
              children: "Save",
              onClick: handleClose,
              disabled:
                !isSparksValid || localSparks === tableState?.config.sparks,
            },
          }}
        />
      )}

      {sparkModalOpen && (
        <SparkModal
          handleClose={() => {
            setSparkModalOpen(false);
          }}
          handleSave={() => {
            console.log("SAVE");
          }}
        />
      )}
    </>
  );
}
