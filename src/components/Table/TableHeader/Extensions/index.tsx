import { useState } from "react";
import _isEqual from "lodash/isEqual";
import { db } from "../../../../firebase";
import { useSnackbar } from "notistack";

import { Breadcrumbs, Typography, Button } from "@mui/material";

import TableHeaderButton from "../TableHeaderButton";
import ExtensionIcon from "assets/icons/Extension";
import Modal from "components/Modal";
import ExtensionList from "./ExtensionList";
import ExtensionModal from "./ExtensionModal";
import ExtensionMigration from "./ExtensionMigration";

import { useProjectContext } from "contexts/ProjectContext";
import { useAppContext } from "contexts/AppContext";
import { useConfirmation } from "components/ConfirmationDialog";
import { useSnackLogContext } from "contexts/SnackLogContext";

import { emptyExtensionObject, IExtension, IExtensionType } from "./utils";
import { name } from "@root/package.json";
import { RunRoutes } from "@src/constants/runRoutes";
import { analytics } from "@src/analytics";

export default function ExtensionsEditor() {
  const { enqueueSnackbar } = useSnackbar();
  const { tableState, tableActions, rowyRun } = useProjectContext();
  const appContext = useAppContext();
  const { requestConfirmation } = useConfirmation();
  const currentextensionObjects = (tableState?.config.extensionObjects ??
    []) as IExtension[];
  const [localExtensionsObjects, setLocalExtensionsObjects] = useState(
    currentextensionObjects
  );
  const [openExtensionList, setOpenExtensionList] = useState(false);
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
      setOpenExtensionList(true);
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
          setOpenExtensionList(false);
        },
      });
    } else {
      setOpenExtensionList(false);
    }
  };

  const handleSaveExtensions = () => {
    tableActions?.table.updateConfig(
      "extensionObjects",
      localExtensionsObjects
    );
    setOpenExtensionList(false);
  };

  const handleSaveDeploy = async () => {
    handleSaveExtensions();
    try {
      snackLogContext.requestSnackLog();
      if (rowyRun)
        rowyRun({
          route: RunRoutes.buildFunction,
          body: {
            triggerPath: "",
          },
        });
      analytics.logEvent("deployed_extensions");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddExtension = (extensionObject: IExtension) => {
    setLocalExtensionsObjects([...localExtensionsObjects, extensionObject]);
    analytics.logEvent("created_extension", { type: extensionObject.type });
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
    analytics.logEvent("updated_extension", { type: extensionObject.type });
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
    analytics.logEvent("duplicated_extension", {
      type: localExtensionsObjects[index].type,
    });
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

      {openExtensionList && !!tableState && (
        <Modal
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          title="Extensions"
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
          handleUpgradeComplete={() => {
            setOpenMigrationGuide(false);
            setOpenExtensionList(true);
          }}
        />
      )}
    </>
  );
}
