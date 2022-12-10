import useSWR from "swr";
import { useAtom } from "jotai";
import { startCase, upperCase } from "lodash-es";
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
  Box,
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
import CloudLogSeverityIcon, {
  SEVERITY_LEVELS,
  SEVERITY_LEVELS_ROWY,
} from "./CloudLogSeverityIcon";

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
                <ToggleButton value="rowy">Rowy Logging</ToggleButton>
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

            {cloudLogFilters.type === "rowy" && <></>}
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

                {cloudLogFilters.type !== "rowy" && (
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
                )}
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
        </>
      }
    >
      {cloudLogFilters.type === "build" ? (
        <BuildLogs />
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "visible",
          }}
        >
          <Box mt={1}>
            {cloudLogFilters.type === "rowy" ? (
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-start"
                alignItems="center"
                sx={{
                  overflowX: "auto",
                  overflowY: "hidden",
                }}
              >
                <Button
                  onClick={(v) => {
                    setCloudLogFilters((prev) => ({
                      ...prev,
                      functionType: undefined,
                      loggingSource: undefined,
                      webhook: undefined,
                      extension: undefined,
                      severity: undefined,
                    }));
                  }}
                >
                  Reset
                </Button>
                <MultiSelect
                  multiple
                  SearchBoxProps={{
                    sx: { display: "none" },
                  }}
                  aria-label="Type:"
                  options={[
                    "extension",
                    "hooks",
                    "action",
                    "derivative-script",
                    "derivative-function",
                    "defaultValue",
                    "connector",
                  ]}
                  value={cloudLogFilters.functionType ?? []}
                  onChange={(v) => {
                    setCloudLogFilters((prev) => ({
                      ...prev,
                      functionType: v,
                    }));
                  }}
                  TextFieldProps={{
                    id: "functionType",
                    className: "labelHorizontal",
                    sx: { "& .MuiInputBase-root": { width: 200 } },
                    fullWidth: false,
                    SelectProps: {
                      renderValue: () => {
                        if (cloudLogFilters?.functionType?.length === 1) {
                          return `Type (${cloudLogFilters.functionType[0]})`;
                        } else if (cloudLogFilters?.functionType?.length) {
                          return `Type (${cloudLogFilters.functionType.length})`;
                        } else {
                          return `Type`;
                        }
                      },
                    },
                  }}
                  itemRenderer={(option) => <>{upperCase(option.value)}</>}
                />
                <MultiSelect
                  multiple
                  aria-label="Source:"
                  options={["backend-scripts", "backend-function", "hooks"]}
                  value={cloudLogFilters.loggingSource ?? []}
                  onChange={(v) => {
                    setCloudLogFilters((prev) => ({
                      ...prev,
                      loggingSource: v,
                    }));
                  }}
                  TextFieldProps={{
                    id: "loggingSource",
                    className: "labelHorizontal",
                    sx: { "& .MuiInputBase-root": { width: 200 } },
                    fullWidth: false,
                    SelectProps: {
                      renderValue: () => {
                        if (cloudLogFilters?.loggingSource?.length === 1) {
                          return `Source (${cloudLogFilters.loggingSource[0]})`;
                        } else if (cloudLogFilters?.loggingSource?.length) {
                          return `Source (${cloudLogFilters.loggingSource.length})`;
                        } else {
                          return `Source`;
                        }
                      },
                    },
                  }}
                  itemRenderer={(option) => <>{upperCase(option.value)}</>}
                />
                <MultiSelect
                  multiple
                  aria-label="Webhook:"
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
                    SelectProps: {
                      renderValue: () => {
                        if (cloudLogFilters?.webhook?.length) {
                          return `Webhook (${cloudLogFilters.webhook.length})`;
                        } else {
                          return `Webhook`;
                        }
                      },
                    },
                  }}
                  itemRenderer={(option) => (
                    <>
                      {option.label}&nbsp;<code>{option.value}</code>
                    </>
                  )}
                />
                <MultiSelect
                  multiple
                  aria-label={"Extension"}
                  labelPlural="extensions"
                  options={
                    Array.isArray(tableSchema.extensionObjects)
                      ? tableSchema.extensionObjects.map((x) => ({
                          label: x.name,
                          value: x.name,
                          type: x.type,
                        }))
                      : []
                  }
                  value={cloudLogFilters.extension ?? []}
                  onChange={(v) =>
                    setCloudLogFilters((prev) => ({ ...prev, extension: v }))
                  }
                  TextFieldProps={{
                    id: "extension",
                    className: "labelHorizontal",
                    sx: { "& .MuiInputBase-root": { width: 180 } },
                    fullWidth: false,
                    placeholder: "Extension",
                    SelectProps: {
                      renderValue: () => {
                        if (cloudLogFilters?.extension?.length === 1) {
                          return `Extension (${cloudLogFilters.extension[0]})`;
                        } else if (cloudLogFilters?.extension?.length) {
                          return `Extension (${cloudLogFilters.extension.length})`;
                        } else {
                          return `Extension`;
                        }
                      },
                    },
                  }}
                  itemRenderer={(option) => (
                    <>
                      {option.label}&nbsp;<code>{option.type}</code>
                    </>
                  )}
                />
                <MultiSelect
                  multiple
                  aria-label={"Column"}
                  options={Object.entries(tableSchema.columns ?? {}).map(
                    ([key, config]) => ({
                      label: config.name,
                      value: key,
                      type: config.type,
                    })
                  )}
                  value={cloudLogFilters.column ?? []}
                  onChange={(v) =>
                    setCloudLogFilters((prev) => ({ ...prev, column: v }))
                  }
                  TextFieldProps={{
                    id: "column",
                    className: "labelHorizontal",
                    sx: { "& .MuiInputBase-root": { width: 200 } },
                    fullWidth: false,
                    placeholder: "Column",
                    SelectProps: {
                      renderValue: () => {
                        if (cloudLogFilters?.column?.length === 1) {
                          return `Column (${cloudLogFilters.column[0]})`;
                        } else if (cloudLogFilters?.column?.length) {
                          return `Column (${cloudLogFilters.column.length})`;
                        } else {
                          return `Column`;
                        }
                      },
                    },
                  }}
                  itemRenderer={(option) => (
                    <>
                      {option.label}&nbsp;<code>{option.value}</code>&nbsp;
                      <code>{option.type}</code>
                    </>
                  )}
                />
                <MultiSelect
                  aria-label="Severity"
                  labelPlural="severity levels"
                  options={Object.keys(SEVERITY_LEVELS_ROWY)}
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
              </Stack>
            ) : null}
          </Box>
          <Box
            sx={{
              overflowY: "scroll",
            }}
          >
            {Array.isArray(data) && data.length > 0 ? (
              <Box>
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
              </Box>
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
                  cloudLogFilters.type === "rowy"
                    ? "There are no logs matching the filters"
                    : cloudLogFilters.type === "audit" &&
                      tableSettings.audit === false
                    ? "Auditing is disabled in this table"
                    : "\xa0"
                }
              />
            )}
          </Box>
        </Box>
      )}
    </Modal>
  );
}
