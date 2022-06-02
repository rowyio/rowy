import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { isEqual } from "lodash-es";

import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import { Extension as ExtensionIcon } from "@src/assets/icons";
import Modal from "@src/components/Modal";
import AddExtensionButton from "./AddExtensionButton";
import ExtensionList from "./ExtensionList";
import ExtensionModal from "./ExtensionModal";
import ExtensionMigration from "./ExtensionMigration";

import {
  globalScope,
  currentUserAtom,
  projectSettingsAtom,
  rowyRunAtom,
  rowyRunModalAtom,
  confirmDialogAtom,
  tableModalAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  updateTableSchemaAtom,
} from "@src/atoms/tableScope";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";

import { emptyExtensionObject, IExtension, ExtensionType } from "./utils";
import { runRoutes } from "@src/constants/runRoutes";
import { analytics, logEvent } from "@src/analytics";
import { getTableSchemaPath } from "@src/utils/table";

export default function Extensions() {
  const [currentUser] = useAtom(currentUserAtom, globalScope);
  const [projectSettings] = useAtom(projectSettingsAtom, globalScope);
  const [rowyRun] = useAtom(rowyRunAtom, globalScope);
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, globalScope);
  const confirm = useSetAtom(confirmDialogAtom, globalScope);
  const [modal, setModal] = useAtom(tableModalAtom, globalScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [updateTableSchema] = useAtom(updateTableSchemaAtom, tableScope);

  const currentExtensionObjects = (tableSchema.extensionObjects ??
    []) as IExtension[];
  const [localExtensionsObjects, setLocalExtensionsObjects] = useState(
    currentExtensionObjects
  );

  const open = modal === "extensions";
  const setOpen = (open: boolean) => setModal(open ? "extensions" : null);

  const [openMigrationGuide, setOpenMigrationGuide] = useState(false);
  const [extensionModal, setExtensionModal] = useState<{
    mode: "add" | "update";
    extensionObject: IExtension;
    index?: number;
  } | null>(null);

  const snackLogContext = useSnackLogContext();
  const edited = !isEqual(currentExtensionObjects, localExtensionsObjects);

  if (!projectSettings.rowyRunUrl)
    return (
      <TableToolbarButton
        title="Extensions"
        onClick={() => openRowyRunModal({ feature: "Extensions" })}
        icon={<ExtensionIcon />}
      />
    );

  const handleOpen = () => {
    if (tableSchema.sparks) {
      // migration is required
      console.log("Extension migration required.");
      setOpenMigrationGuide(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = (
    _setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (edited) {
      _setOpen(true);
      confirm({
        title: "Discard changes?",
        confirm: "Discard",
        handleConfirm: () => {
          _setOpen(false);
          setLocalExtensionsObjects(currentExtensionObjects);
          setOpen(false);
        },
      });
    } else {
      setOpen(false);
    }
  };

  const handleSaveExtensions = async (callback?: Function) => {
    if (updateTableSchema)
      await updateTableSchema({ extensionObjects: localExtensionsObjects });
    if (callback) callback();
    setOpen(false);
  };

  const handleSaveDeploy = async () => {
    handleSaveExtensions(() => {
      try {
        if (rowyRun) {
          snackLogContext.requestSnackLog();
          rowyRun({
            route: runRoutes.buildFunction,
            body: {
              tablePath: tableSettings.collection,
              pathname: window.location.pathname,
              tableConfigPath: getTableSchemaPath(tableSettings),
            },
          });
          logEvent(analytics, "deployed_extensions");
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

  const handleAddExtension = (extensionObject: IExtension) => {
    setLocalExtensionsObjects([...localExtensionsObjects, extensionObject]);
    logEvent(analytics, "created_extension", { type: extensionObject.type });
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
    logEvent(analytics, "updated_extension", { type: extensionObject.type });
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
    logEvent(analytics, "duplicated_extension", {
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
    confirm({
      title: `Delete “${localExtensionsObjects[index].name}”?`,
      body: "This Extension will be permanently deleted when you save",
      confirm: "Confirm",
      handleConfirm: () => {
        setLocalExtensionsObjects(
          localExtensionsObjects.filter((_, i) => i !== index)
        );
      },
    });
  };

  const currentEditor = () => ({
    displayName: currentUser?.displayName ?? "Unknown user",
    photoURL: currentUser?.photoURL ?? "",
    lastUpdate: Date.now(),
  });

  const activeExtensionCount = localExtensionsObjects.filter(
    (extension) => extension.active
  ).length;

  return (
    <>
      <TableToolbarButton
        title="Extensions"
        onClick={handleOpen}
        icon={<ExtensionIcon />}
      />
      {open && (
        <Modal
          onClose={handleClose}
          disableBackdropClick={edited}
          disableEscapeKeyDown={edited}
          maxWidth="sm"
          fullWidth
          title={`Extensions (${activeExtensionCount}\u2009/\u2009${localExtensionsObjects.length})`}
          header={
            <AddExtensionButton
              handleAddExtension={(type: ExtensionType) => {
                setExtensionModal({
                  mode: "add",
                  extensionObject: emptyExtensionObject(type, currentEditor()),
                });
              }}
              variant={
                localExtensionsObjects.length === 0 ? "contained" : "outlined"
              }
            />
          }
          children={
            <ExtensionList
              extensions={localExtensionsObjects}
              handleUpdateActive={handleUpdateActive}
              handleEdit={handleEdit}
              handleDuplicate={handleDuplicate}
              handleDelete={handleDelete}
            />
          }
          actions={{
            primary: {
              children: "Save & Deploy",
              onClick: handleSaveDeploy,
              disabled: !edited,
            },
            secondary: {
              children: "Save",
              onClick: () => handleSaveExtensions(),
              disabled: !edited,
            },
          }}
        />
      )}
      {extensionModal && (
        <ExtensionModal
          handleClose={() => setExtensionModal(null)}
          handleAdd={handleAddExtension}
          handleUpdate={handleUpdateExtension}
          mode={extensionModal.mode}
          extensionObject={extensionModal.extensionObject}
        />
      )}
      {openMigrationGuide && (
        <ExtensionMigration
          handleClose={() => setOpenMigrationGuide(false)}
          handleUpgradeComplete={() => {
            setOpenMigrationGuide(false);
            setOpen(true);
          }}
        />
      )}
    </>
  );
}
