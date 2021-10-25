import _isEqual from "lodash/isEqual";
import _upperFirst from "lodash/upperFirst";

import Modal, { IModalProps } from "components/Modal";

import { IWebhook } from "./utils";
import useCollection from "@src/hooks/useCollection";
import { useEffect } from "react";
import { useProjectContext } from "contexts/ProjectContext";
import { Typography } from "@mui/material";
import { orderBy } from "lodash";

export interface IWebhookLogsProps {
  handleClose: IModalProps["onClose"];
  webhookObject: IWebhook;
}

export default function WebhookModal({
  handleClose,
  webhookObject,
}: IWebhookLogsProps) {
  const { tableState } = useProjectContext();
  const [logsCollection, logsDispatch] = useCollection({});
  useEffect(() => {
    if (webhookObject && tableState?.tablePath) {
      logsDispatch({
        path: "_rowy_/webhooks/logs",
        filters: [
          {
            field: "params.endpoint",
            operator: "==",
            value: webhookObject.endpoint,
          },
          {
            field: "params.tablePath",
            operator: "==",
            value: tableState?.tablePath,
          },
        ],
        orderBy: { key: "createdAt", direction: "desc" },
        limit: 50,
      });
    }
  }, [webhookObject, tableState?.tablePath]);
  return (
    <Modal
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      title={`Webhook Logs: ${webhookObject.name}`}
      sx={{
        "& .MuiPaper-root": {
          maxWidth: 742 + 20,
          height: 980,
        },
      }}
      children={
        <>
          {logsCollection.documents.map((doc) => (
            <Typography>{`${doc.createdAt.toDate()} - ${
              doc.response
            }`}</Typography>
          ))}
        </>
      }
      actions={{
        primary: {
          onClick: () => {},
        },
      }}
    />
  );
}
