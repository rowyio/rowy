import React, { useState } from "react";
import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import _isEqual from "lodash/isEqual";
import { useConfirmation } from "components/ConfirmationDialog";
import { useSnackContext } from "contexts/SnackContext";
import { db } from "../../../../firebase";

import { Breadcrumbs, Typography } from "@material-ui/core";
import TableHeaderButton from "../TableHeaderButton";
import SparkIcon from "@material-ui/icons/OfflineBolt";
import Modal from "components/Modal";
import { useFiretableContext } from "contexts/FiretableContext";
import { useAppContext } from "contexts/AppContext";
import { useSnackLogContext } from "contexts/SnackLogContext";
import SparkList from "./SparkList";
import SparkModal from "./SparkModal";

import { serialiseSpark, emptySparkObject, ISpark, ISparkType } from "./utils";

export default function SparksEditor() {
  const snack = useSnackContext();
  const { tableState, tableActions } = useFiretableContext();
  const appContext = useAppContext();
  const { requestConfirmation } = useConfirmation();
  const currentSparkObjects = (tableState?.config.sparkObjects ??
    []) as ISpark[];
  const [localSparksObjects, setLocalSparksObjects] = useState(
    currentSparkObjects
  );
  const [open, setOpen] = useState(false);
  const [sparkModal, setSparkModal] = useState<{
    mode: "add" | "update";
    sparkObject: ISpark;
    index?: number;
  } | null>(null);
  const snackLogContext = useSnackLogContext();

  const edited = !_isEqual(currentSparkObjects, localSparksObjects);

  const tablePathTokens =
    tableState?.tablePath?.split("/").filter(function (_, i) {
      // replace IDs with dash that appears at even indexes
      return i % 2 === 0;
    }) ?? [];

  const handleClose = () => {
    if (edited) {
      requestConfirmation({
        title: "Discard Changes",
        body: "You will lose changes you have made to sparks",
        confirm: "Discard",
        handleConfirm: () => {
          setLocalSparksObjects(currentSparkObjects);
          setOpen(false);
        },
      });
    } else {
      setOpen(false);
    }
  };

  const handleSave = () => {
    // tableActions?.table.updateConfig("sparks", localSparks);
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

  const handleSaveSparks = () => {
    tableActions?.table.updateConfig("sparkObjects", localSparksObjects);
    setOpen(false);
  };

  const handleSaveDeploy = () => {
    handleSaveSparks();
  };

  const handleAddSpark = (sparkObject: ISpark) => {
    setLocalSparksObjects([...localSparksObjects, sparkObject]);
    setSparkModal(null);
  };

  const handleUpdateSpark = (sparkObject: ISpark) => {
    setLocalSparksObjects(
      currentSparkObjects.map((spark, index) => {
        if (index === sparkModal?.index) {
          return {
            ...sparkObject,
            lastEditor: currentEditor(),
          };
        } else {
          return spark;
        }
      })
    );
    setSparkModal(null);
  };

  const handleUpdateActive = (index: number, active: boolean) => {
    setLocalSparksObjects(
      localSparksObjects.map((sparkObject, i) => {
        if (i === index) {
          return {
            ...sparkObject,
            active,
            lastEditor: currentEditor(),
          };
        } else {
          return sparkObject;
        }
      })
    );
  };

  const handleDuplicate = (index: number) => {
    setLocalSparksObjects([
      ...localSparksObjects,
      {
        ...localSparksObjects[index],
        name: `${localSparksObjects[index].name} (duplicate)`,
        active: false,
        lastEditor: currentEditor(),
      },
    ]);
  };

  const handleEdit = (index: number) => {
    setSparkModal({
      mode: "update",
      sparkObject: localSparksObjects[index],
      index,
    });
  };

  const handleDelete = (index: number) => {
    requestConfirmation({
      title: `Delete ${localSparksObjects[index].name}?`,
      body: "This spark will be permanently deleted.",
      confirm: "Confirm",
      handleConfirm: () => {
        setLocalSparksObjects(localSparksObjects.filter((_, i) => i !== index));
      },
    });
  };

  const currentEditor = () => ({
    displayName: appContext?.currentUser?.displayName ?? "Unknown user",
    photoURL: appContext?.currentUser?.photoURL ?? "",
    lastUpdate: Date.now(),
  });

  return (
    <>
      <TableHeaderButton
        title="Sparks"
        onClick={() => setOpen(true)}
        icon={<SparkIcon />}
      />

      {open && !!tableState && (
        <Modal
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          title={<>Sparks</>}
          children={
            <>
              <Breadcrumbs aria-label="breadcrumb">
                {tablePathTokens.map((pathToken) => {
                  return <Typography>{pathToken}</Typography>;
                })}
              </Breadcrumbs>
              <SparkList
                sparks={localSparksObjects}
                handleAddSpark={(type: ISparkType) => {
                  setSparkModal({
                    mode: "add",
                    sparkObject: emptySparkObject(type, currentEditor()),
                  });
                }}
                handleUpdateActive={handleUpdateActive}
                handleEdit={handleEdit}
                handleDuplicate={handleDuplicate}
                handleDelete={handleDelete}
              />
            </>
          }
          actions={{
            primary: {
              children: "Save & Deploy",
              onClick: handleSaveDeploy,
              disabled: !edited,
            },
            secondary: {
              children: "Save",
              onClick: handleSaveSparks,
              disabled: !edited,
            },
          }}
        />
      )}

      {sparkModal && (
        <SparkModal
          handleClose={() => {
            setSparkModal(null);
          }}
          handleAdd={handleAddSpark}
          handleUpdate={handleUpdateSpark}
          mode={sparkModal.mode}
          sparkObject={sparkModal.sparkObject}
        />
      )}
    </>
  );
}
