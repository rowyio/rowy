import { format, differenceInCalendarDays } from "date-fns";
import { useAtom } from "jotai";
import { get } from "lodash-es";

import {
  styled,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  Tooltip,
  AccordionDetails,
  List,
  ListProps,
} from "@mui/material";
import SuccessIcon from "@mui/icons-material/Check";
import FailIcon from "@mui/icons-material/Close";
import HourglassIcon from "@mui/icons-material/HourglassEmpty";
import { CloudLogs as LogsIcon } from "@src/assets/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import EmptyState from "@src/components/EmptyState";
import BuildLogList from "./BuildLogList";
import CloudLogSubheader from "@src/components/TableModals/CloudLogsModal/CloudLogSubheader";

import { DATE_TIME_FORMAT } from "@src/constants/dates";
import useBuildLogs from "./useBuildLogs";
import { tableScope, cloudLogFiltersAtom } from "@src/atoms/tableScope";

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  background: "none",
  marginTop: 0,
  "&::before": { display: "none" },

  ...(theme.typography.caption as any),
  fontFamily: theme.typography.fontFamilyMono,
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  minHeight: 32,
  alignItems: "flex-start",

  padding: theme.spacing(0, 1.375, 0, 1.5),
  borderRadius: theme.shape.borderRadius,
  "&:hover": { backgroundColor: theme.palette.action.hover },

  userSelect: "auto",

  "&.Mui-expanded": {
    backgroundColor: theme.palette.background.paper,
    ".MuiPaper-elevation24 &": {
      backgroundImage:
        "linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      zIndex: -1,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: "inherit",

      transition: theme.transitions.create(["background-color"], {
        duration: theme.transitions.duration.short,
      }),
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover::before": { backgroundColor: theme.palette.action.selected },
    "&.Mui-focusVisible::before": {
      backgroundColor: theme.palette.action.disabledBackground,
    },

    position: "sticky",
    zIndex: 1,
    top: 0,
    ".MuiListSubheader-sticky ~ li &": { top: 32 },
  },

  "& svg": {
    fontSize: 18,
    height: 20,
  },

  "& .MuiAccordionSummary-content, & .MuiAccordionSummary-expandIconWrapper": {
    marginTop: (32 - 20) / 2,
    marginBottom: (32 - 20) / 2,
  },

  "& .MuiAccordionSummary-content": {
    overflow: "hidden",
    paddingRight: theme.spacing(1),
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(0.5, 2),
    "& > *": { flexShrink: 0 },

    [theme.breakpoints.down("lg")]: {
      flexWrap: "wrap",
      paddingLeft: theme.spacing(18 / 8 + 2),
      "& > :first-child": { marginLeft: theme.spacing((18 / 8 + 2) * -1) },
    },
  },
}));

export default function BuildLogs(props: Partial<ListProps>) {
  const { logs, latestStatus } = useBuildLogs();
  const [cloudLogFilters, setCloudLogFilters] = useAtom(
    cloudLogFiltersAtom,
    tableScope
  );

  if (!latestStatus)
    return (
      <EmptyState
        Icon={LogsIcon}
        message="No logs"
        description="You have no cloud deploys for this table"
      />
    );

  const renderedLogItems: React.ReactNode[] = [];

  for (let i = 0; i < logs.length; i++) {
    const logEntry = logs[i];
    const prevEntry = logs[i - 1];

    // Group by day
    const diff = differenceInCalendarDays(
      Date.now(),
      get(logEntry, "startTimeStamp") ?? 0
    );
    const prevDiff = differenceInCalendarDays(
      Date.now(),
      get(prevEntry, "startTimeStamp") ?? 0
    );

    if (diff !== prevDiff) {
      renderedLogItems.push(
        <CloudLogSubheader key={`${diff} days ago`}>
          {diff === 0 ? "Today" : diff === 1 ? "Yesterday" : `${diff} days ago`}
        </CloudLogSubheader>
      );
    }

    renderedLogItems.push(
      <li key={logEntry.startTimeStamp}>
        <Accordion
          disableGutters
          elevation={0}
          square
          TransitionProps={{ unmountOnExit: true }}
          expanded={cloudLogFilters.buildLogExpanded === i}
          onChange={(_, expanded) =>
            setCloudLogFilters((c) => ({
              ...c,
              buildLogExpanded: expanded ? i : -1,
            }))
          }
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${logEntry.id}-content`}
            id={`${logEntry.id}-header`}
          >
            {logEntry.status === "BUILDING" && (
              <Tooltip title="Building">
                <HourglassIcon />
              </Tooltip>
            )}
            {logEntry.status === "SUCCESS" && (
              <Tooltip title="Success">
                <SuccessIcon color="success" />
              </Tooltip>
            )}
            {logEntry.status === "FAIL" && (
              <Tooltip title="Fail">
                <FailIcon color="error" />
              </Tooltip>
            )}

            {format(logEntry.startTimeStamp, DATE_TIME_FORMAT + ":ss.SSS X")}
          </AccordionSummary>

          <AccordionDetails style={{ paddingLeft: 0, paddingRight: 0 }}>
            <BuildLogList
              key={i}
              value={cloudLogFilters.buildLogExpanded!}
              index={i}
              logs={logEntry?.fullLog}
              status={logEntry?.status}
            />
          </AccordionDetails>
        </Accordion>
      </li>
    );
  }

  return (
    <List
      disablePadding
      {...({ component: "ol" } as any)}
      {...props}
      sx={{ mx: -1.5, mt: 1.5, ...props.sx }}
    >
      {renderedLogItems}
    </List>
  );
}
