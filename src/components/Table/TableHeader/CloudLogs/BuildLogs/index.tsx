import { format } from "date-fns";
import { useAtom } from "jotai";

import {
  styled,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  Tooltip,
  AccordionDetails,
} from "@mui/material";
import SuccessIcon from "@mui/icons-material/Check";
import FailIcon from "@mui/icons-material/Close";
import HourglassIcon from "@mui/icons-material/HourglassEmpty";
import LogsIcon from "@src/assets/icons/CloudLogs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import EmptyState from "@src/components/EmptyState";
import BuildLogList from "./BuildLogList";

import { DATE_TIME_FORMAT } from "@src/constants/dates";
import useBuildLogs from "./useBuildLogs";
import { cloudLogFiltersAtom } from "../utils";

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  background: "none",
  marginTop: 0,
  margin: theme.spacing(0, -1.5),
  "&::before": { display: "none" },

  ...theme.typography.caption,
  fontFamily: theme.typography.fontFamilyMono,
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  minHeight: 32,
  alignItems: "flex-start",

  "&.Mui-expanded": {
    backgroundColor: theme.palette.action.hover,
    "&:hover": { backgroundColor: theme.palette.action.selected },
    "&.Mui-focusVisible": {
      backgroundColor: theme.palette.action.disabledBackground,
    },
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

  padding: theme.spacing(0, 1.375, 0, 1.5),
  borderRadius: theme.shape.borderRadius,
  "&:hover": { backgroundColor: theme.palette.action.hover },

  userSelect: "auto",
}));

export default function BuildLogs() {
  const { collectionState, latestStatus } = useBuildLogs();
  const [cloudLogFilters, setCloudLogFilters] = useAtom(cloudLogFiltersAtom);

  if (!latestStatus)
    return (
      <EmptyState
        Icon={LogsIcon}
        message="No logs"
        description="You have no cloud deploys for this table"
      />
    );

  return collectionState.documents.map((logEntry, index) => (
    <Accordion
      disableGutters
      elevation={0}
      square
      TransitionProps={{ unmountOnExit: true }}
      expanded={cloudLogFilters.buildLogExpanded === index}
      onChange={(_, expanded) =>
        setCloudLogFilters((c) => ({
          ...c,
          buildLogExpanded: expanded ? index : -1,
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
          key={index}
          value={cloudLogFilters.buildLogExpanded!}
          index={index}
          logs={logEntry?.fullLog}
          status={logEntry?.status}
        />
      </AccordionDetails>
    </Accordion>
  ));
}
