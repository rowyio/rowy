import { useState } from "react";
import _isEqual from "lodash/isEqual";

import { Breadcrumbs } from "@mui/material";

import TableHeaderButton from "../TableHeaderButton";
import WebhookIcon from "assets/icons/Webhook";
import Modal from "components/Modal";
import WebhookList from "./WebhookList";
import WebhookModal from "./WebhookModal";

import { useProjectContext } from "contexts/ProjectContext";
import { useAppContext } from "contexts/AppContext";
import { useConfirmation } from "components/ConfirmationDialog";

import { emptyWebhookObject, IWebhook, WebhookType } from "./utils";
import { runRoutes } from "constants/runRoutes";
import { analytics } from "@src/analytics";
import { useSnackbar } from "notistack";

export default function Webhooks() {
  const { tableState, tableActions, rowyRun } = useProjectContext();
  const appContext = useAppContext();
  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();

  const currentwebhooks = (tableState?.config.webhooks ?? []) as IWebhook[];
  const [localWebhooksObjects, setLocalWebhooksObjects] =
    useState(currentwebhooks);
  const [openWebhookList, setOpenWebhookList] = useState(false);
  const [webhookModal, setWebhookModal] = useState<{
    mode: "add" | "update";
    webhookObject: IWebhook;
    index?: number;
  } | null>(null);

  const edited = !_isEqual(currentwebhooks, localWebhooksObjects);

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
          setLocalWebhooksObjects(currentwebhooks);
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

  const handleDuplicate = (index: number) => {
    setLocalWebhooksObjects([
      ...localWebhooksObjects,
      {
        ...localWebhooksObjects[index],
        name: `${localWebhooksObjects[index].name} (duplicate)`,
        active: false,
        lastEditor: currentEditor(),
      },
    ]);
    analytics.logEvent("duplicated_webhook", {
      type: localWebhooksObjects[index].type,
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
        title="Webhook"
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
    </>
  );
}
