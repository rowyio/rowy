import { useState } from "react";
import _isEqual from "lodash/isEqual";

import { Breadcrumbs } from "@mui/material";

import TableHeaderButton from "../TableHeaderButton";
import WebhookIcon from "@src/assets/icons/Webhook";
import Modal from "@src/components/Modal";
import WebhookList from "./WebhookList";
import WebhookModal from "./WebhookModal";
import WebhookLogs from "./WebhookLogs";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { useAppContext } from "@src/contexts/AppContext";
import { useConfirmation } from "@src/components/ConfirmationDialog";

import { emptyWebhookObject, IWebhook, WebhookType } from "./utils";
import { runRoutes } from "@src/constants/runRoutes";
import { analytics } from "@src/analytics";
import { useSnackbar } from "notistack";

export default function Webhooks() {
  const { tableState, tableActions, rowyRun, compatibleRowyRunVersion } =
    useProjectContext();
  const appContext = useAppContext();
  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();

  const currentWebhooks = (tableState?.config.webhooks ?? []) as IWebhook[];
  const [localWebhooksObjects, setLocalWebhooksObjects] =
    useState(currentWebhooks);
  const [openWebhookList, setOpenWebhookList] = useState(false);
  const [webhookModal, setWebhookModal] = useState<{
    mode: "add" | "update";
    webhookObject: IWebhook;
    index?: number;
  } | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<IWebhook | null>();
  if (!compatibleRowyRunVersion?.({ minVersion: "1.1.1" })) return <></>;
  const edited = !_isEqual(currentWebhooks, localWebhooksObjects);

  const tablePathTokens =
    tableState?.tablePath?.split("/").filter(function (_, i) {
      // replace IDs with dash that appears at even indexes
      return i % 2 === 0;
    }) ?? [];

  const handleOpen = () => {
    setOpenWebhookList(true);
  };

  const handleClose = () => {
    if (edited) {
      requestConfirmation({
        title: "Discard changes",
        body: "You will lose changes you have made to webhooks",
        confirm: "Discard",
        handleConfirm: () => {
          setLocalWebhooksObjects(currentWebhooks);
          setOpenWebhookList(false);
        },
      });
    } else {
      setOpenWebhookList(false);
    }
  };

  const handleSaveWebhooks = async () => {
    tableActions?.table.updateConfig("webhooks", localWebhooksObjects);
    setOpenWebhookList(false);
    // TODO: convert to async function that awaits for the document write to complete
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleSaveDeploy = async () => {
    await handleSaveWebhooks();
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
  };

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

  const handleOpenLogs = (index: number) => {
    const _webhook = localWebhooksObjects[index];

    setWebhookLogs(_webhook);
    analytics.logEvent("view_webhook_logs", {
      type: _webhook.type,
    });
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
      title: `Delete ${localWebhooksObjects[index].name}?`,
      body: "This webhook will be permanently deleted.",
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

  return (
    <>
      <TableHeaderButton
        title="Webhooks"
        onClick={handleOpen}
        icon={<WebhookIcon />}
      />

      {openWebhookList && !!tableState && (
        <Modal
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          title="Webhooks"
          children={
            <>
              <Breadcrumbs aria-label="breadcrumb">
                {tablePathTokens.map((pathToken) => (
                  <code>{pathToken}</code>
                ))}
              </Breadcrumbs>
              <WebhookList
                webhooks={localWebhooksObjects}
                handleAddWebhook={(type: WebhookType) => {
                  setWebhookModal({
                    mode: "add",
                    webhookObject: emptyWebhookObject(type, currentEditor()),
                  });
                }}
                handleUpdateActive={handleUpdateActive}
                handleEdit={handleEdit}
                handleOpenLogs={handleOpenLogs}
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
              onClick: handleSaveWebhooks,
              disabled: !edited,
            },
          }}
        />
      )}

      {webhookModal && (
        <WebhookModal
          handleClose={() => {
            setWebhookModal(null);
          }}
          handleAdd={handleAddWebhook}
          handleUpdate={handleUpdateWebhook}
          mode={webhookModal.mode}
          webhookObject={webhookModal.webhookObject}
        />
      )}
      {webhookLogs && (
        <WebhookLogs
          webhookObject={webhookLogs}
          handleClose={() => {
            setWebhookLogs(null);
          }}
        />
      )}
    </>
  );
}
