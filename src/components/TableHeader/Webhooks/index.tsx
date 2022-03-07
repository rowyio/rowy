import { useState } from "react";
import { useAtom } from "jotai";
import _isEqual from "lodash/isEqual";

import TableHeaderButton from "../TableHeaderButton";
import WebhookIcon from "@mui/icons-material/Webhook";
import Modal from "@src/components/Modal";
import AddWebhookButton from "./AddWebhookButton";
import WebhookList from "./WebhookList";
import WebhookModal from "./WebhookModal";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { useAppContext } from "@src/contexts/AppContext";
import { useConfirmation } from "@src/components/ConfirmationDialog";

import { emptyWebhookObject, IWebhook, WebhookType } from "./utils";
import { runRoutes } from "@src/constants/runRoutes";
import { analytics } from "@src/analytics";
import { useSnackbar } from "notistack";
import { modalAtom } from "@src/atoms/Table";
import { useRowyRunModal } from "@src/atoms/RowyRunModal";

export default function Webhooks() {
  const { tableState, table, tableActions, rowyRun, compatibleRowyRunVersion } =
    useProjectContext();
  const appContext = useAppContext();
  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();

  const currentWebhooks = (tableState?.config.webhooks ?? []) as IWebhook[];
  const [localWebhooksObjects, setLocalWebhooksObjects] =
    useState(currentWebhooks);

  const [modal, setModal] = useAtom(modalAtom);
  const open = modal === "webhooks";
  const setOpen = (open: boolean) => setModal(open ? "webhooks" : "");

  const [webhookModal, setWebhookModal] = useState<{
    mode: "add" | "update";
    webhookObject: IWebhook;
    index?: number;
  } | null>(null);

  const openRowyRunModal = useRowyRunModal();
  if (!compatibleRowyRunVersion?.({ minVersion: "1.2.0" }))
    return (
      <TableHeaderButton
        title="Webhooks"
        onClick={() => openRowyRunModal("Webhooks", "1.2.0")}
        icon={<WebhookIcon />}
      />
    );

  const edited = !_isEqual(currentWebhooks, localWebhooksObjects);

  const handleOpen = () => setOpen(true);

  const handleClose = (
    _setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (edited) {
      _setOpen(true);
      requestConfirmation({
        title: "Discard changes?",
        confirm: "Discard",
        handleConfirm: () => {
          _setOpen(false);
          setLocalWebhooksObjects(currentWebhooks);
          setOpen(false);
        },
      });
    } else {
      setOpen(false);
    }
  };

  const handleSaveWebhooks = async (callback?: Function) => {
    tableActions?.table.updateConfig(
      "webhooks",
      localWebhooksObjects,
      callback
    );
    setOpen(false);
    // TODO: convert to async function that awaits for the document write to complete
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleSaveDeploy = () =>
    handleSaveWebhooks(async () => {
      try {
        if (rowyRun) {
          const resp = await rowyRun({
            service: "hooks",
            route: runRoutes.publishWebhooks,
            body: {
              tableConfigPath: tableState?.config.tableConfig.path,
              tablePath: tableState?.tablePath,
            },
          });
          enqueueSnackbar(resp.message, {
            variant: resp.success ? "success" : "error",
          });
          analytics.logEvent("published_webhooks");
        }
      } catch (e) {
        console.error(e);
      }
    });

  const handleAddWebhook = (webhookObject: IWebhook) => {
    setLocalWebhooksObjects([...localWebhooksObjects, webhookObject]);
    analytics.logEvent("created_webhook", { type: webhookObject.type });
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
    analytics.logEvent("updated_webhook", { type: webhookObject.type });
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
    requestConfirmation({
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
    displayName: appContext?.currentUser?.displayName ?? "Unknown user",
    photoURL: appContext?.currentUser?.photoURL ?? "",
    lastUpdate: Date.now(),
  });

  const activeWebhookCount = localWebhooksObjects.filter(
    (webhook) => webhook.active
  ).length;

  return (
    <>
      <TableHeaderButton
        title="Webhooks"
        onClick={handleOpen}
        icon={<WebhookIcon />}
      />

      {open && !!tableState && (
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
                    table
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
      )}

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
