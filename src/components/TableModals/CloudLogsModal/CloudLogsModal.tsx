import useSWR from "swr";
import { useAtom } from "jotai";
import { startCase } from "lodash-es";
import { ITableModalProps } from "@src/components/TableModals";

import {
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CloudLogs as LogsIcon } from "@src/assets/icons";

import Modal from "@src/components/Modal";
import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import MultiSelect from "@rowy/multiselect";
import TimeRangeSelect from "./TimeRangeSelect";
import CloudLogList from "./CloudLogList";
import BuildLogs from "./BuildLogs";
import EmptyState from "@src/components/EmptyState";
import CloudLogSeverityIcon, { SEVERITY_LEVELS } from "./CloudLogSeverityIcon";

import {
  projectScope,
  projectIdAtom,
  rowyRunAtom,
  compatibleRowyRunVersionAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  cloudLogFiltersAtom,
} from "@src/atoms/tableScope";
import { cloudLogFetcher } from "./utils";

export default function CloudLogsModal({ onClose }: ITableModalProps) {
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    projectScope
  );
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [cloudLogFilters, setCloudLogFilters] = useAtom(
    cloudLogFiltersAtom,
    tableScope
  );

  const { data, mutate, isValidating } = useSWR(
    cloudLogFilters.type === "build"
      ? null
      : [
          "/logs",
          rowyRun,
          projectId,
          cloudLogFilters,
          tableSettings.collection || "",
        ],
    cloudLogFetcher,
    {
      fallbackData: [],
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <Modal
      title="Cloud logs"
      onClose={onClose}
      maxWidth="xl"
      fullScreen
      ScrollableDialogContentProps={{ disableBottomDivider: true }}
      header={
        <>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{
              mt: { md: "calc(var(--dialog-title-height) * -1)" },
              "&, & .MuiTab-root": {
                minHeight: { md: "var(--dialog-title-height)" },
              },
              ml: { md: 18 },
              mr: { md: 40 / 8 + 3 },

              minHeight: 32,
              boxSizing: "content-box",
              overflowX: "auto",
              overflowY: "hidden",
              py: 0,
              px: { xs: "var(--dialog-spacing)", md: 0 },
              pb: { xs: 1.5, md: 0 },

              "& > *": { flexShrink: 0 },
            }}
          >
            {compatibleRowyRunVersion!({ minVersion: "1.2.0" }) ? (
              <ToggleButtonGroup
                value={cloudLogFilters.type}
                exclusive
                onChange={(_, v) =>
                  setCloudLogFilters((c) => ({
                    type: v,
                    timeRange: c.timeRange,
                  }))
                }
                aria-label="Filter by log type"
              >
                <ToggleButton value="webhook">Webhooks</ToggleButton>
                <ToggleButton value="functions">Functions</ToggleButton>
                <ToggleButton value="audit">Audit</ToggleButton>
                <ToggleButton value="build">Build</ToggleButton>
              </ToggleButtonGroup>
            ) : (
              <ToggleButtonGroup
                value={cloudLogFilters.type}
                exclusive
                onChange={(_, v) =>
                  setCloudLogFilters((c) => ({
                    type: v,
                    timeRange: c.timeRange,
                  }))
                }
                aria-label="Filter by log type"
              >
                <ToggleButton value="build">Build</ToggleButton>
              </ToggleButtonGroup>
            )}

            {cloudLogFilters.type === "webhook" && (
              <MultiSelect
                multiple
                label="Webhook:"
                labelPlural="webhooks"
                options={
                  Array.isArray(tableSchema.webhooks)
                    ? tableSchema.webhooks.map((x) => ({
                        label: x.name,
                        value: x.endpoint,
                      }))
                    : []
                }
                value={cloudLogFilters.webhook ?? []}
                onChange={(v) =>
                  setCloudLogFilters((prev) => ({ ...prev, webhook: v }))
                }
                TextFieldProps={{
                  id: "webhook",
                  className: "labelHorizontal",
                  sx: { "& .MuiInputBase-root": { width: 180 } },
                  fullWidth: false,
                }}
                itemRenderer={(option) => (
                  <>
                    {option.label}&nbsp;<code>{option.value}</code>
                  </>
                )}
              />
            )}
            {cloudLogFilters.type === "audit" && (
              <TextField
                id="auditRowId"
                label="Row ID:"
                value={cloudLogFilters.auditRowId}
                onChange={(e) =>
                  setCloudLogFilters((prev) => ({
                    ...prev,
                    auditRowId: e.target.value,
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {tableSettings.collection}/
                    </InputAdornment>
                  ),
                }}
                className="labelHorizontal"
                sx={{
                  "& .MuiInputBase-root, & .MuiInputBase-input": {
                    typography: "body2",
                    fontFamily: "mono",
                  },
                  "& .MuiInputAdornment-positionStart": {
                    m: "0 !important",
                    pointerEvents: "none",
                  },
                  "& .MuiInputBase-input": { pl: 0 },
                }}
              />
            )}

            {/* Spacer */}
            <div style={{ flexGrow: 1 }} />

            {cloudLogFilters.type !== "build" && (
              <>
                {!isValidating && Array.isArray(data) && (
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    display="block"
                    style={{ userSelect: "none" }}
                  >
                    {data.length} entries
                  </Typography>
                )}

                <MultiSelect
                  aria-label="Severity"
                  labelPlural="severity levels"
                  options={Object.keys(SEVERITY_LEVELS)}
                  value={cloudLogFilters.severity ?? []}
                  onChange={(severity) =>
                    setCloudLogFilters((prev) => ({ ...prev, severity }))
                  }
                  TextFieldProps={{
                    style: { width: 130 },
                    placeholder: "Severity",
                    SelectProps: {
                      renderValue: () => {
                        if (
                          !Array.isArray(cloudLogFilters.severity) ||
                          cloudLogFilters.severity.length === 0
                        )
                          return `Severity`;

                        if (cloudLogFilters.severity.length === 1)
                          return (
                            <>
                              Severity{" "}
                              <CloudLogSeverityIcon
                                severity={cloudLogFilters.severity[0]}
                                style={{ marginTop: -2, marginBottom: -7 }}
                              />
                            </>
                          );

                        return `Severity (${cloudLogFilters.severity.length})`;
                      },
                    },
                  }}
                  itemRenderer={(option) => (
                    <>
                      <CloudLogSeverityIcon
                        severity={option.value}
                        sx={{ mr: 1 }}
                      />
                      {startCase(option.value.toLowerCase())}
                    </>
                  )}
                />
                <TimeRangeSelect
                  aria-label="Time range"
                  value={cloudLogFilters.timeRange}
                  onChange={(value) =>
                    setCloudLogFilters((c) => ({ ...c, timeRange: value }))
                  }
                />
                <TableToolbarButton
                  onClick={() => mutate()}
                  title="Refresh"
                  icon={<RefreshIcon />}
                  disabled={isValidating}
                />
              </>
            )}
          </Stack>

          {isValidating && (
            <LinearProgress
              style={{
                borderRadius: 0,
                marginTop: -4,
                marginBottom: -1,
                minHeight: 4,
              }}
            />
          )}

          {/* <code>{logQueryUrl}</code> */}
        </>
      }
    >
      {cloudLogFilters.type === "build" ? (
        <BuildLogs />
      ) : Array.isArray(data) && data.length > 0 ? (
        <>
          <CloudLogList items={data} sx={{ mx: -1.5, mt: 1.5 }} />
          {cloudLogFilters.timeRange.type !== "range" && (
            <Button
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                display: "flex",
              }}
              onClick={() =>
                setCloudLogFilters((c) => ({
                  ...c,
                  timeRange: {
                    ...c.timeRange,
                    value: (c.timeRange as any).value * 2,
                  },
                }))
              }
            >
              Load more (last {cloudLogFilters.timeRange.value * 2}{" "}
              {cloudLogFilters.timeRange.type})
            </Button>
          )}
        </>
      ) : isValidating ? (
        <EmptyState
          Icon={LogsIcon}
          message="Fetching logs…"
          description={"\xa0"}
        />
      ) : (
        <EmptyState
          Icon={LogsIcon}
          message="No logs"
          description={
            cloudLogFilters.type === "webhook" &&
            (!Array.isArray(tableSchema.webhooks) ||
              tableSchema.webhooks?.length === 0)
              ? "There are no webhooks in this table"
              : cloudLogFilters.type === "audit" &&
                tableSettings.audit === false
              ? "Auditing is disabled in this table"
              : "\xa0"
          }
        />
      )}
    </Modal>
  );
}
