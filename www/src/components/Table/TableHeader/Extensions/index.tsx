import React, { useState, useEffect } from "react";
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
import ExtensionIcon from "@material-ui/icons/OfflineBolt";
import Modal from "components/Modal";
import { useFiretableContext } from "contexts/FiretableContext";
import { useAppContext } from "contexts/AppContext";
import { useSnackLogContext } from "contexts/SnackLogContext";
import ExtensionList from "./ExtensionList";
import ExtensionModal from "./ExtensionModal";
import ExtensionMigration from "./ExtensionMigration";

import {
  serialiseExtension,
  emptyExtensionObject,
  IExtension,
  IExtensionType,
} from "./utils";

export default function ExtensionsEditor() {
  const snack = useSnackContext();
  const { tableState, tableActions } = useFiretableContext();
  const appContext = useAppContext();
  const { requestConfirmation } = useConfirmation();
  const currentextensionObjects = (tableState?.config.extensionObjects ??
    []) as IExtension[];
  const [localExtensionsObjects, setLocalExtensionsObjects] = useState(
    currentextensionObjects
  );
  const [open, setOpen] = useState(false);
  const [openMigrationGuide, setOpenMigrationGuide] = useState(false);
  const [extensionModal, setExtensionModal] = useState<{
    mode: "add" | "update";
    extensionObject: IExtension;
    index?: number;
  } | null>(null);
  const snackLogContext = useSnackLogContext();
  const edited = !_isEqual(currentextensionObjects, localExtensionsObjects);

  const tablePathTokens =
    tableState?.tablePath?.split("/").filter(function (_, i) {
      // replace IDs with dash that appears at even indexes
      return i % 2 === 0;
    }) ?? [];

  const handleOpen = () => {
    if (tableState?.config.sparks) {
      // migration is required
      console.log("Extension migration required.");
      setOpenMigrationGuide(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    if (edited) {
      requestConfirmation({
        title: "Discard Changes",
        body: "You will lose changes you have made to extensions",
        confirm: "Discard",
        handleConfirm: () => {
          setLocalExtensionsObjects(currentextensionObjects);
          setOpen(false);
        },
      });
    } else {
      setOpen(false);
    }
  };

  const handleSaveExtensions = () => {
    tableActions?.table.updateConfig(
      "extensionObjects",
      localExtensionsObjects
    );
    setOpen(false);
  };

  const handleSaveDeploy = async () => {
    handleSaveExtensions();

    // compile extension objects into ft-build readable extension string
    const serialisedExtension = serialiseExtension(localExtensionsObjects);
    tableActions?.table.updateConfig("extensions", serialisedExtension);

    const settingsDoc = await db.doc("/_FIRETABLE_/settings").get();
    const ftBuildUrl = settingsDoc.get("ftBuildUrl");
    if (!ftBuildUrl) {
      snack.open({
        message:
          "Cloud Run trigger URL not configured. Configuration guide: https://github.com/AntlerVC/firetable/wiki/Setting-up-cloud-Run-FT-Builder",
        variant: "error",
      });
    }

    // request GCP build
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
  };

  const handleAddExtension = (extensionObject: IExtension) => {
    setLocalExtensionsObjects([...localExtensionsObjects, extensionObject]);
    setExtensionModal(null);
  };

  const handleUpdateExtension = (extensionObject: IExtension) => {
    setLocalExtensionsObjects(
      localExtensionsObjects.map((extension, index) => {
        if (index === extensionModal?.index) {
          return {
            ...extensionObject,
            lastEditor: currentEditor(),
          };
        } else {
          return extension;
        }
      })
    );
    setExtensionModal(null);
  };

  const handleUpdateActive = (index: number, active: boolean) => {
    setLocalExtensionsObjects(
      localExtensionsObjects.map((extensionObject, i) => {
        if (i === index) {
          return {
            ...extensionObject,
            active,
            lastEditor: currentEditor(),
          };
        } else {
          return extensionObject;
        }
      })
    );
  };

  const handleDuplicate = (index: number) => {
    setLocalExtensionsObjects([
      ...localExtensionsObjects,
      {
        ...localExtensionsObjects[index],
        name: `${localExtensionsObjects[index].name} (duplicate)`,
        active: false,
        lastEditor: currentEditor(),
      },
    ]);
  };

  const handleEdit = (index: number) => {
    setExtensionModal({
      mode: "update",
      extensionObject: localExtensionsObjects[index],
      index,
    });
  };

  const handleDelete = (index: number) => {
    requestConfirmation({
      title: `Delete ${localExtensionsObjects[index].name}?`,
      body: "This extension will be permanently deleted.",
      confirm: "Confirm",
      handleConfirm: () => {
        setLocalExtensionsObjects(
          localExtensionsObjects.filter((_, i) => i !== index)
        );
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
        title="Extensions"
        onClick={handleOpen}
        icon={<ExtensionIcon />}
      />

      {open && !!tableState && (
        <Modal
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          title={<>Extensions</>}
          children={
            <>
              <Breadcrumbs aria-label="breadcrumb">
                {tablePathTokens.map((pathToken) => {
                  return <Typography>{pathToken}</Typography>;
                })}
              </Breadcrumbs>
              <ExtensionList
                extensions={localExtensionsObjects}
                handleAddExtension={(type: IExtensionType) => {
                  setExtensionModal({
                    mode: "add",
                    extensionObject: emptyExtensionObject(
                      type,
                      currentEditor()
                    ),
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
              onClick: handleSaveExtensions,
              disabled: !edited,
            },
          }}
        />
      )}

      {extensionModal && (
        <ExtensionModal
          handleClose={() => {
            setExtensionModal(null);
          }}
          handleAdd={handleAddExtension}
          handleUpdate={handleUpdateExtension}
          mode={extensionModal.mode}
          extensionObject={extensionModal.extensionObject}
        />
      )}

      {openMigrationGuide && (
        <ExtensionMigration
          handleClose={() => {
            setOpenMigrationGuide(false);
          }}
        />
      )}
    </>
  );
}
