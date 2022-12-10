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
      if (cloudLogFilters?.functionType?.length)
        logQuery.push(
          cloudLogFilters.functionType
            .map((functionType) => {
              return `jsonPayload.functionType = "${functionType}"`;
            })
            .join(encodeURIComponent(" OR "))
        );
      if (cloudLogFilters?.loggingSource?.length) {
        logQuery.push(
          cloudLogFilters.loggingSource
            .map((loggingSource) => {
              return `jsonPayload.loggingSource = "${loggingSource}"`;
            })
            .join(encodeURIComponent(" OR "))
        );
      } else {
        // mandatory filter to remove unwanted gcp diagnostic logs
        logQuery.push(
          ["backend-scripts", "backend-function", "hooks"]
            .map((loggingSource) => {
              return `jsonPayload.loggingSource = "${loggingSource}"`;
            })
            .join(encodeURIComponent(" OR "))
        );
      }
      if (cloudLogFilters?.webhook?.length) {
        logQuery.push(
          cloudLogFilters.webhook
            .map((id) => `jsonPayload.url : "${id}"`)
            .join(encodeURIComponent(" OR "))
        );
      }
      if (cloudLogFilters?.extension?.length)
        logQuery.push(
          cloudLogFilters.extension
            .map((extensionName) => {
              return `jsonPayload.extensionName = "${extensionName}"`;
            })
            .join(encodeURIComponent(" OR "))
        );
      if (cloudLogFilters?.column?.length)
        logQuery.push(
          cloudLogFilters.column
            .map((column) => {
              return `jsonPayload.fieldName = "${column}"`;
            })
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
