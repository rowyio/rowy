import useSWR from "swr";
import { useAtom } from "jotai";

import {
  LinearProgress,
  Tab,
  Stack,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import RefreshIcon from "@mui/icons-material/Refresh";

import Modal, { IModalProps } from "@src/components/Modal";
import TableHeaderButton from "@src/components/Table/TableHeader/TableHeaderButton";
import MultiSelect from "@rowy/multiselect";
import TimeRangeSelect from "./TimeRangeSelect";
import CloudLogList from "./CloudLogList";
import EmptyState from "@src/components/EmptyState";
import LogsIcon from "@src/assets/icons/CloudLogs";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { cloudLogFiltersAtom, cloudLogFetcher } from "./utils";

export default function CloudLogsModal(props: IModalProps) {
  const { rowyRun, tableState, table } = useProjectContext();

  const [cloudLogFilters, setCloudLogFilters] = useAtom(cloudLogFiltersAtom);

  const { data, mutate, isValidating } = useSWR(
    cloudLogFilters.type === "build"
      ? null
      : ["/logs", rowyRun, cloudLogFilters, tableState?.tablePath || ""],
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
      {...props}
      maxWidth="xl"
      fullWidth
      fullHeight
      ScrollableDialogContentProps={{ disableBottomDivider: true }}
      header={
        <TabContext value={cloudLogFilters.type}>
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

              minHeight: 56,
              overflowX: "auto",
              overflowY: "hidden",
              py: 0,
              px: { xs: "var(--dialog-spacing)", md: 0 },

              "& .MuiTabPanel-root": { padding: 0 },
              "& > *": { flexShrink: 0 },
            }}
          >
            <TabList
              onChange={(_, v) =>
                setCloudLogFilters((c) => ({ type: v, timeRange: c.timeRange }))
              }
              aria-label="Filter by log type"
              // centered
              sx={{}}
            >
              {/* {!Array.isArray(tableState?.config.webhooks) ||
              tableState?.config.webhooks?.length === 0 ? ( */}
              <Tab label="Webhooks" value="webhook" />
              {/* {table?.audit === false ? ( */}
              <Tab label="Audit" value="audit" />
              <Tab label="Build" value="build" />
            </TabList>

            <TabPanel value="webhook">
              <MultiSelect
                multiple
                label="Webhook:"
                labelPlural="webhooks"
                options={
                  Array.isArray(tableState?.config.webhooks)
                    ? tableState!.config.webhooks.map((x) => ({
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
                  sx: {
                    flexDirection: "row",
                    alignItems: "center",
                    "& .MuiInputLabel-root": { pr: 1 },
                    "& .MuiInputBase-root": { minWidth: 180 },
                  },
                }}
                itemRenderer={(option) => (
                  <>
                    {option.label}&nbsp;<code>{option.value}</code>
                  </>
                )}
              />
            </TabPanel>
            <TabPanel value="audit">
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
                      {tableState?.tablePath}/
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  "& .MuiInputLabel-root": { pr: 1 },

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
            </TabPanel>

            {/* Spacer */}
            <div style={{ flexGrow: 1 }} />

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

            <TimeRangeSelect
              aria-label="Time range"
              value={cloudLogFilters.timeRange}
              onChange={(value) =>
                setCloudLogFilters((c) => ({ ...c, timeRange: value }))
              }
            />
            <TableHeaderButton
              onClick={() => mutate()}
              title="Refresh"
              icon={<RefreshIcon />}
              disabled={isValidating}
            />
          </Stack>

          {isValidating && (
            <LinearProgress
              style={{
                borderRadius: 0,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            />
          )}

          {/* <code>{logQueryUrl}</code> */}
        </TabContext>
      }
    >
      {Array.isArray(data) &&
        (data.length > 0 ? (
          <CloudLogList items={data} sx={{ mx: -1.5, mt: 1.5 }} />
        ) : isValidating ? (
          <EmptyState
            Icon={LogsIcon}
            message="Fetching logs…"
            description="\xa0"
          />
        ) : (
          <EmptyState
            Icon={LogsIcon}
            message="No logs"
            description={
              cloudLogFilters.type === "webhook" &&
              (!Array.isArray(tableState?.config.webhooks) ||
                tableState?.config.webhooks?.length === 0)
                ? "There are no webhooks in this table"
                : cloudLogFilters.type === "audit" && table?.audit === false
                ? "Auditing is disabled in this table"
                : "\xa0"
            }
          />
        ))}
    </Modal>
  );
}
