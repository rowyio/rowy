import _get from "lodash/get";
import { differenceInCalendarDays } from "date-fns";

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

      // Group by function execution ID if available
      if (item.labels.execution_id) {
        if (
          _get(item, "labels.execution_id") !==
          _get(prevItem, "labels.execution_id")
        ) {
          renderedLogItems.push(
            <CloudLogSubheader key={_get(item, "labels.execution_id")}>
              Function{" "}
              <code>{_get(item, "resource.labels.function_name")}</code>{" "}
              execution <code>{_get(item, "labels.execution_id")}</code>
            </CloudLogSubheader>
          );
        }
      }
      // Otherwise, group by day
      else {
        const diff = differenceInCalendarDays(
          Date.now(),
          (_get(item, "timestamp.seconds") ?? 0) * 1000
        );
        const prevDiff = differenceInCalendarDays(
          Date.now(),
          (_get(prevItem, "timestamp.seconds") ?? 0) * 1000
        );

        if (diff !== prevDiff) {
          renderedLogItems.push(
            <CloudLogSubheader key={`${diff} days ago`}>
              {diff === 0
                ? "Today"
                : diff === 1
                ? "Yesterday"
                : `${diff} days ago`}
            </CloudLogSubheader>
          );
        }
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
