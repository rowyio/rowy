import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { isEqual } from "lodash-es";
import { useSnackbar } from "notistack";
import { ITableModalProps } from "@src/components/TableModals";

import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import WebhookIcon from "@mui/icons-material/Webhook";
import Modal from "@src/components/Modal";
import AddWebhookButton from "./AddWebhookButton";
import WebhookList from "./WebhookList";
import WebhookModal from "./WebhookModal";

import {
  projectScope,
  currentUserAtom,
  rowyRunAtom,
  compatibleRowyRunVersionAtom,
  rowyRunModalAtom,
  confirmDialogAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  updateTableSchemaAtom,
  tableModalAtom,
} from "@src/atoms/tableScope";
import { emptyWebhookObject, IWebhook, WebhookType } from "./utils";
import { runRoutes } from "@src/constants/runRoutes";
import { analytics, logEvent } from "@src/analytics";
import { getTableSchemaPath } from "@src/utils/table";

export default function WebhooksModal({ onClose }: ITableModalProps) {
  const [currentUser] = useAtom(currentUserAtom, projectScope);
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    projectScope
  );
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [updateTableSchema] = useAtom(updateTableSchemaAtom, tableScope);
  const { enqueueSnackbar } = useSnackbar();

  const currentWebhooks = (tableSchema.webhooks ?? []) as IWebhook[];
  const [localWebhooksObjects, setLocalWebhooksObjects] =
    useState(currentWebhooks);

  const [webhookModal, setWebhookModal] = useState<{
    mode: "add" | "update";
    webhookObject: IWebhook;
    index?: number;
  } | null>(null);

  if (!compatibleRowyRunVersion({ minVersion: "1.2.0" }))
    return (
      <TableToolbarButton
        title="Webhooks"
        onClick={() =>
          openRowyRunModal({ feature: "Webhooks", version: "1.2.0" })
        }
        icon={<WebhookIcon />}
      />
    );

  const edited = !isEqual(currentWebhooks, localWebhooksObjects);

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
          setLocalWebhooksObjects(currentWebhooks);
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  const handleSaveWebhooks = async (callback?: Function) => {
    if (updateTableSchema) {
      await updateTableSchema({ webhooks: localWebhooksObjects });
    }
    if (callback) callback();
    onClose();
  };

  const handleSaveDeploy = () =>
    handleSaveWebhooks(async () => {
      try {
        if (rowyRun) {
          const resp = await rowyRun({
            service: "hooks",
            route: runRoutes.publishWebhooks,
            body: {
              tableConfigPath: getTableSchemaPath(tableSettings),
              tablePath: tableSettings.collection,
            },
          });
          enqueueSnackbar(resp.message, {
            variant: resp.success ? "success" : "error",
          });
          logEvent(analytics, "published_webhooks");
        }
      } catch (e) {
        console.error(e);
      }
    });

  const handleAddWebhook = (webhookObject: IWebhook) => {
    setLocalWebhooksObjects([...localWebhooksObjects, webhookObject]);
    logEvent(analytics, "created_webhook", { type: webhookObject.type });
    setWebhookModal(null);
  };

  const handleUpdateWebhook = (webhookObject: IWebhook) => {
    setLocalWebhooksObjects(
      localWebhooksObjects.map((webhook, index) => {
        if (index === webhookModal?.index) {
          return {
            ...webhookObject,
            lastEditor: currentEditor(),
          };
        } else {
          return webhook;
        }
      })
    );
    logEvent(analytics, "updated_webhook", { type: webhookObject.type });
    setWebhookModal(null);
  };

  const handleUpdateActive = (index: number, active: boolean) => {
    setLocalWebhooksObjects(
      localWebhooksObjects.map((webhookObject, i) => {
        if (i === index) {
          return {
            ...webhookObject,
            active,
            lastEditor: currentEditor(),
          };
        } else {
          return webhookObject;
        }
      })
    );
  };

  const handleEdit = (index: number) => {
    setWebhookModal({
      mode: "update",
      webhookObject: localWebhooksObjects[index],
      index,
    });
  };

  const handleDelete = (index: number) => {
    confirm({
      title: `Delete “${localWebhooksObjects[index].name}”?`,
      body: "This webhook will be permanently deleted when you save",
      confirm: "Confirm",
      handleConfirm: () => {
        setLocalWebhooksObjects(
          localWebhooksObjects.filter((_, i) => i !== index)
        );
      },
    });
  };

  const currentEditor = () => ({
    displayName: currentUser?.displayName ?? "Unknown user",
    photoURL: currentUser?.photoURL ?? "",
    lastUpdate: Date.now(),
  });

  const activeWebhookCount = localWebhooksObjects.filter(
    (webhook) => webhook.active
  ).length;

  return (
    <>
      <Modal
        onClose={handleClose}
        disableBackdropClick={edited}
        disableEscapeKeyDown={edited}
        maxWidth="sm"
        fullWidth
        title={`Webhooks (${activeWebhookCount}\u2009/\u2009${localWebhooksObjects.length})`}
        header={
          <AddWebhookButton
            handleAddWebhook={(type: WebhookType) => {
              setWebhookModal({
                mode: "add",
                webhookObject: emptyWebhookObject(
                  type,
                  currentEditor(),
                  tableSettings
                ),
              });
            }}
            variant={
              localWebhooksObjects.length === 0 ? "contained" : "outlined"
            }
          />
        }
        children={
          <WebhookList
            webhooks={localWebhooksObjects}
            handleUpdateActive={handleUpdateActive}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        }
        actions={{
          primary: {
            children: "Save & Deploy",
            onClick: () => {
              handleSaveDeploy();
            },
            disabled: !edited,
          },
          secondary: {
            children: "Save",
            onClick: () => {
              handleSaveWebhooks();
            },
            disabled: !edited,
          },
        }}
      />

      {webhookModal && (
        <WebhookModal
          handleClose={() => setWebhookModal(null)}
          handleAdd={handleAddWebhook}
          handleUpdate={handleUpdateWebhook}
          mode={webhookModal.mode}
          webhookObject={webhookModal.webhookObject}
        />
      )}
    </>
  );
}
