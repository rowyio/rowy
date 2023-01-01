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
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CloudLogs as LogsIcon } from "@src/assets/icons";
import ClearIcon from "@mui/icons-material/Clear";

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
import { FieldType } from "@src/constants/fields";
import { WIKI_LINKS } from "@src/constants/externalLinks";

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
              ml: { md: 20 },
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
                onChange={(_, newType) => {
                  setCloudLogFilters((c) => ({
                    type: newType,
                    timeRange: c.timeRange,
                  }));
                  if (
                    [
                      "extension",
                      "webhook",
                      "column",
                      "audit",
                      "functions",
                    ].includes(newType)
                  ) {
                    setTimeout(() => {
                      mutate();
                    }, 0);
                  }
                }}
                aria-label="Filter by log type"
              >
                <ToggleButton value="extension">Extension</ToggleButton>
                <ToggleButton value="webhook">Webhook</ToggleButton>
                <ToggleButton value="column">Column</ToggleButton>
                <ToggleButton value="audit">Audit</ToggleButton>
                <ToggleButton value="build">Build</ToggleButton>
                <ToggleButton value="functions">
                  Functions (legacy)
                </ToggleButton>
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

            <div style={{ flexGrow: 1 }} />
            {cloudLogFilters.type !== "build" && (
              <>
                <Typography
                  variant="body2"
                  color="text.disabled"
                  display="block"
                  style={{ userSelect: "none" }}
                >
                  {isValidating ? "" : `${data?.length ?? 0} entries`}
                </Typography>
                <TableToolbarButton
                  onClick={() => {
                    setCloudLogFilters((prev) => ({
                      ...prev,
                      functionType: undefined,
                      loggingSource: undefined,
                      webhook: undefined,
                      extension: undefined,
                      severity: undefined,
                    }));
                  }}
                  title="Clear Filters"
                  icon={<ClearIcon />}
                  disabled={isValidating}
                />
                <TableToolbarButton
                  onClick={() => mutate()}
                  title="Refresh"
                  icon={
                    isValidating ? (
                      <CircularProgress size={15} thickness={4} />
                    ) : (
                      <RefreshIcon />
                    )
                  }
                  disabled={isValidating}
                />
              </>
            )}
          </Stack>
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
          {["extension", "webhook", "column", "audit", "functions"].includes(
            cloudLogFilters.type
          ) ? (
            <Stack
              width={"100%"}
              direction="row"
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
              sx={{
                overflowX: "auto",
                overflowY: "hidden",
                margin: "8px 0",
                flex: "0 0 32px",
              }}
            >
              {cloudLogFilters.type === "functions" ? (
                <Box width={"100%"}></Box>
              ) : null}
              {cloudLogFilters.type === "extension" ? (
                <>
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
                      sx: {
                        width: "100%",
                        "& .MuiInputBase-root": { width: "100%" },
                      },
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
                </>
              ) : null}
              {cloudLogFilters.type === "webhook" ? (
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
                    sx: {
                      width: "100%",
                      "& .MuiInputBase-root": { width: "100%" },
                    },
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
              ) : null}
              {cloudLogFilters.type === "column" ? (
                <>
                  <MultiSelect
                    multiple
                    aria-label={"Column"}
                    options={Object.entries(tableSchema.columns ?? {})
                      .filter(
                        ([key, config]) =>
                          config?.config?.defaultValue?.type === "dynamic" ||
                          [
                            FieldType.action,
                            FieldType.derivative,
                            FieldType.connector,
                          ].includes(config.type)
                      )
                      .map(([key, config]) => ({
                        label: config.name,
                        value: key,
                        type: config.type,
                      }))}
                    value={cloudLogFilters.column ?? []}
                    onChange={(v) =>
                      setCloudLogFilters((prev) => ({ ...prev, column: v }))
                    }
                    TextFieldProps={{
                      id: "column",
                      className: "labelHorizontal",
                      sx: {
                        width: "100%",
                        "& .MuiInputBase-root": { width: "100%" },
                      },
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
                </>
              ) : null}
              {cloudLogFilters.type === "audit" ? (
                <>
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
                      width: "100%",
                      "& .MuiInputBase-root, & .MuiInputBase-input": {
                        width: "100%",
                        typography: "body2",
                        fontFamily: "mono",
                      },
                      "& .MuiInputAdornment-positionStart": {
                        m: "0 !important",
                        pointerEvents: "none",
                      },
                      "& .MuiInputBase-input": { pl: 0 },
                      "& .MuiFormLabel-root": {
                        whiteSpace: "nowrap",
                      },
                    }}
                  />
                </>
              ) : null}
              <MultiSelect
                aria-label="Severity"
                labelPlural="severity levels"
                options={Object.keys(SEVERITY_LEVELS_ROWY)}
                value={cloudLogFilters.severity ?? []}
                onChange={(severity) =>
                  setCloudLogFilters((prev) => ({ ...prev, severity }))
                }
                TextFieldProps={{
                  style: { width: 200 },
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
            </Stack>
          ) : null}
          {["extension", "webhook", "column"].includes(
            cloudLogFilters.type
          ) && (
            <Alert severity="info">
              Remember to use <code>logging</code> functions,{" "}
              <code>log,warning,error</code> for them to appear in the logs
              bellow{" "}
              <Link
                component="a"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
                href={WIKI_LINKS.cloudLogs}
              >
                Learn more
              </Link>
            </Alert>
          )}
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
                    onClick={() => {
                      setCloudLogFilters((c) => ({
                        ...c,
                        timeRange: {
                          ...c.timeRange,
                          value: (c.timeRange as any).value * 2,
                        },
                      }));
                      setTimeout(() => {
                        mutate();
                      }, 0);
                    }}
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
                  cloudLogFilters.type !== "audit"
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
