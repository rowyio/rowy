import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { isEqual, isUndefined } from "lodash-es";
import { ITableModalProps } from "@src/components/TableModals";

import Modal from "@src/components/Modal";
import AddExtensionButton from "./AddExtensionButton";
import ExtensionList from "./ExtensionList";
import ExtensionModal from "./ExtensionModal";
import ExtensionMigration from "./ExtensionMigration";

import {
  projectScope,
  currentUserAtom,
  rowyRunAtom,
  confirmDialogAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  updateTableSchemaAtom,
} from "@src/atoms/tableScope";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";

import { runRoutes } from "@src/constants/runRoutes";
import { analytics, logEvent } from "@src/analytics";
import {
  getTableSchemaPath,
  getTableBuildFunctionPathname,
} from "@src/utils/table";

import {
  emptyExtensionObject,
  IExtension,
  ExtensionType,
  IRuntimeOptions,
} from "./utils";
import RuntimeOptions from "./RuntimeOptions";

export default function ExtensionsModal({ onClose }: ITableModalProps) {
  const [currentUser] = useAtom(currentUserAtom, projectScope);
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [updateTableSchema] = useAtom(updateTableSchemaAtom, tableScope);

  const [localExtensionsObjects, setLocalExtensionsObjects] = useState(
    tableSchema.extensionObjects ?? []
  );

  const [localRuntimeOptions, setLocalRuntimeOptions] = useState(
    tableSchema.runtimeOptions ?? {}
  );

  const errors = {
    runtimeOptions: {
      timeoutSeconds:
        !isUndefined(localRuntimeOptions.timeoutSeconds) &&
        !(
          localRuntimeOptions.timeoutSeconds! > 0 &&
          localRuntimeOptions.timeoutSeconds! <= 540
        ),
    },
  };

  const [openMigrationGuide, setOpenMigrationGuide] = useState(false);
  useEffect(() => {
    if (tableSchema.sparks) setOpenMigrationGuide(true);
  }, [tableSchema.sparks]);

  const [extensionModal, setExtensionModal] = useState<{
    mode: "add" | "update";
    extensionObject: IExtension;
    index?: number;
  } | null>(null);

  const snackLogContext = useSnackLogContext();
  const edited =
    !isEqual(tableSchema.extensionObjects ?? [], localExtensionsObjects) ||
    !isEqual(tableSchema.runtimeOptions ?? {}, localRuntimeOptions);

  const handleClose = (
    _setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (edited) {
      _setOpen(true);
      confirm({
        title: "Discard changes?",
        confirm: "Discard",
        cancel: "Keep",
        handleConfirm: () => {
          _setOpen(false);
          setLocalExtensionsObjects(tableSchema.extensionObjects ?? []);
          setLocalRuntimeOptions(tableSchema.runtimeOptions ?? {});
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  const handleSave = async (callback?: Function) => {
    if (updateTableSchema)
      await updateTableSchema({
        extensionObjects: localExtensionsObjects,
        runtimeOptions: localRuntimeOptions,
      });
    if (callback) callback();
    onClose();
  };

  const handleSaveDeploy = async () => {
    handleSave(() => {
      try {
        snackLogContext.requestSnackLog();
        rowyRun({
          route: runRoutes.buildFunction,
          body: {
            tablePath: tableSettings.collection,
            // pathname must match old URL format
            pathname: getTableBuildFunctionPathname(
              tableSettings.id,
              tableSettings.tableType
            ),
            tableConfigPath: getTableSchemaPath(tableSettings),
          },
        });
        logEvent(analytics, "deployed_extensions");
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

  const handleUpdateRuntimeOptions = (update: IRuntimeOptions) => {
    setLocalRuntimeOptions((runtimeOptions) => ({
      ...runtimeOptions,
      ...update,
    }));
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
          <>
            <ExtensionList
              extensions={localExtensionsObjects}
              handleUpdateActive={handleUpdateActive}
              handleEdit={handleEdit}
              handleDuplicate={handleDuplicate}
              handleDelete={handleDelete}
            />
            <RuntimeOptions
              runtimeOptions={localRuntimeOptions}
              handleUpdate={handleUpdateRuntimeOptions}
              errors={errors.runtimeOptions}
            />
          </>
        }
        actions={{
          primary: {
            children: "Save & Deploy",
            onClick: handleSaveDeploy,
            disabled: !edited || errors.runtimeOptions.timeoutSeconds,
          },
          secondary: {
            children: "Save",
            onClick: () => handleSave(),
            disabled: !edited || errors.runtimeOptions.timeoutSeconds,
          },
        }}
      />

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
          }}
        />
      )}
    </>
  );
}
