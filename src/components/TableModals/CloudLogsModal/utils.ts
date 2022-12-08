import { sub } from "date-fns";
import { rowyRunAtom } from "@src/atoms/projectScope";
import { CloudLogFilters } from "@src/atoms/tableScope";

export const cloudLogFetcher = (
  endpointRoot: string,
  rowyRun: ReturnType<typeof rowyRunAtom["read"]>,
  projectId: string,
  cloudLogFilters: CloudLogFilters,
  tablePath: string
) => {
  // https://cloud.google.com/logging/docs/view/logging-query-language
  let logQuery: string[] = [];

  switch (cloudLogFilters.type) {
    case "rowy":
      logQuery.push(`logName = "projects/${projectId}/logs/rowy-logging"`);
      break;
    case "webhook":
      logQuery.push(
        `logName = "projects/${projectId}/logs/rowy-webhook-events"`
      );
      logQuery.push(`jsonPayload.url : "${tablePath}"`);
      if (
        Array.isArray(cloudLogFilters.webhook) &&
        cloudLogFilters.webhook.length > 0
      )
        logQuery.push(
          cloudLogFilters.webhook
            .map((id) => `jsonPayload.url : "${id}"`)
            .join(encodeURIComponent(" OR "))
        );
      break;

    case "audit":
      logQuery.push(`logName = "projects/${projectId}/logs/rowy-audit"`);
      logQuery.push(`jsonPayload.ref.collectionPath = "${tablePath}"`);
      if (cloudLogFilters.auditRowId)
        logQuery.push(
          `jsonPayload.ref.rowId = "${cloudLogFilters.auditRowId}"`
        );
      break;

    case "functions":
      logQuery.push(`resource.labels.function_name = "R-${tablePath}"`);
      break;

    default:
      break;
  }

  if (cloudLogFilters.timeRange.type === "range") {
  } else {
    try {
      const minDate = sub(new Date(), {
        [cloudLogFilters.timeRange.type]: cloudLogFilters.timeRange.value,
      });
      logQuery.push(`timestamp >= "${minDate.toISOString()}"`);
    } catch (e) {
      console.error("Failed to calculate minimum date", e);
    }
  }

  if (
    Array.isArray(cloudLogFilters.severity) &&
    cloudLogFilters.severity.length > 0
  ) {
    logQuery.push(`severity = (${cloudLogFilters.severity.join(" OR ")})`);
  }

  const logQueryUrl =
    endpointRoot +
    (logQuery.length > 0
      ? `?filter=${logQuery
          .map((item) => `(${item})`)
          .join(encodeURIComponent("\n"))}`
      : "");

  if (rowyRun) {
    return rowyRun({
      route: { path: logQueryUrl, method: "GET" },
    });
  }

  return [];
};
