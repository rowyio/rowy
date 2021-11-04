import useSWR from "swr";
import _get from "lodash/get";

import Modal, { IModalProps } from "@src/components/Modal";
import { List, ListSubheader } from "@mui/material";
import LogItem from "./LogItem";

import { useProjectContext } from "@src/contexts/ProjectContext";

export default function CloudLogsModal(props: IModalProps) {
  const { rowyRun } = useProjectContext();

  const { data: logItems } = useSWR(
    "logItems",
    () =>
      rowyRun
        ? rowyRun<Record<string, any>[]>({
            route: {
              // path: "/logs",
              // path: '/logs?filter=resource.labels.function_name="R-githubStars"',
              path: `/logs?filter=logName="${encodeURIComponent(
                "projects/rowyio/logs/rowy-audit-logs"
              )}"`,
              method: "GET",
            },
          })
        : [],
    { fallbackData: [], revalidateOnMount: true }
  );

  const renderedLogItems: React.ReactNodeArray = [];

  if (Array.isArray(logItems)) {
    for (let i = 0; i < logItems.length; i++) {
      const logItem = logItems[i];
      const prevItem = logItems[i - 1];

      if (
        _get(logItem, "labels.execution_id") !==
        _get(prevItem, "labels.execution_id")
      ) {
        renderedLogItems.push(
          <ListSubheader
            key={_get(logItem, "labels.execution_id")}
            disableGutters
            disableSticky
            sx={{
              mt: 2,
              typography: "subtitle2",
              py: (32 - 20) / 2 / 8,
              "& code": { fontSize: "90%" },
            }}
          >
            Function{" "}
            <code>{_get(logItem, "resource.labels.function_name")}</code>{" "}
            execution <code>{_get(logItem, "labels.execution_id")}</code>
          </ListSubheader>
        );
      }

      renderedLogItems.push(
        <li key={logItem.insertId}>
          <LogItem
            data={logItem}
            chips={[
              // Rowy Run HTTP request
              "httpRequest.requestMethod",
              "httpRequest.status",
              // Rowy audit logs
              "jsonPayload.eventType",
              "jsonPayload.eventData.rowPath",
              "jsonPayload.eventData.updatedField",
              "jsonPayload.fields.rowyUser.structValue.fields.displayName.stringValue",
            ]}
          />
        </li>
      );
    }
  }

  return (
    <Modal
      {...props}
      maxWidth="xl"
      fullWidth
      fullHeight
      title={`Cloud logs (${logItems?.length})`}
    >
      <List component="ol" subheader={<li />}>
        {renderedLogItems}
      </List>
    </Modal>
  );
}
