import _get from "lodash/get";

import { List, ListProps } from "@mui/material";
import CloudLogSubheader from "./CloudLogSubheader";
import CloudLogItem from "./CloudLogItem";

export interface ICloudLogListProps extends Partial<ListProps> {
  items: Record<string, any>[];
}

export default function CloudLogList({ items, ...props }: ICloudLogListProps) {
  const renderedLogItems: React.ReactNodeArray = [];
  if (Array.isArray(items)) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const prevItem = items[i - 1];

      if (
        _get(item, "labels.execution_id") !==
        _get(prevItem, "labels.execution_id")
      ) {
        renderedLogItems.push(
          <CloudLogSubheader key={_get(item, "labels.execution_id")}>
            Function <code>{_get(item, "resource.labels.function_name")}</code>{" "}
            execution <code>{_get(item, "labels.execution_id")}</code>
          </CloudLogSubheader>
        );
      }

      renderedLogItems.push(
        <li key={item.insertId}>
          <CloudLogItem
            data={item}
            chips={[
              // Rowy Run HTTP request
              "httpRequest.requestMethod",
              "httpRequest.status",
              // Rowy audit logs
              "jsonPayload.type",
              // "jsonPayload.ref.tableId",
              "jsonPayload.ref.rowId",
              "jsonPayload.data.updatedField",
              "jsonPayload.rowyUser.displayName",
              // Webhook event
              "jsonPayload.params.endpoint",
            ]}
          />
        </li>
      );
    }
  }

  return (
    <List disablePadding {...({ component: "ol" } as any)} {...props}>
      {renderedLogItems}
    </List>
  );
}
