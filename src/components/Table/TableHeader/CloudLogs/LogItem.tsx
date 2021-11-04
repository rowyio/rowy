import { format } from "date-fns";
import _get from "lodash/get";
import ReactJson from "react-json-view";

import {
  styled,
  useTheme,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Stack,
  Chip as MuiChip,
  ChipProps,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogSeverityIcon from "./LogSeverityIcon";

import { DATE_FORMAT, TIME_FORMAT } from "@src/constants/dates";

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  marginTop: 0,
  "&::before": { display: "none" },

  ...theme.typography.caption,
  fontFamily: theme.typography.fontFamilyMono,
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  minHeight: 32,
  alignItems: "flex-start",

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

  "& .log-preview": {
    flexShrink: 1,

    ".Mui-expanded&": {
      overflow: "visible",
      whiteSpace: "pre-wrap",
    },
  },

  margin: theme.spacing(0, -1.5),
  padding: theme.spacing(0, 1.375, 0, 1.5),
  borderRadius: theme.shape.borderRadius,
  "&:hover": { backgroundColor: theme.palette.action.hover },

  userSelect: "auto",
}));

const Chip = styled((props: ChipProps) => <MuiChip size="small" {...props} />)({
  font: "inherit",
  minHeight: 20,
  padding: 0,
  cursor: "inherit",
});

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingLeft: theme.spacing(18 / 8 + 2),
  paddingRight: 0,
}));

export interface ILogItemProps {
  // https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#FIELDS.insert_id
  data: Record<string, any>;
  chips?: string[];
}

export default function LogItem({ data, chips }: ILogItemProps) {
  const theme = useTheme();

  const timestamp = new Date(
    data.timestamp.seconds * 1000 + data.timestamp.nanos / 1_000_000
  );

  const renderedChips = Array.isArray(chips)
    ? chips
        .map((key) => {
          const value = _get(data, key);
          if (!value) return null;

          return (
            <Chip
              key={key}
              label={
                typeof value === "string" || typeof value === "number"
                  ? value
                  : JSON.stringify(value)
              }
              aria-describedby={key}
            />
          );
        })
        .filter(Boolean)
    : [];

  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${data.insertId}-content`}
        id={`${data.insertId}-header`}
      >
        <LogSeverityIcon severity={data.severity} />

        <time dateTime={timestamp.toISOString()}>
          <Typography variant="inherit" color="text.secondary" component="span">
            {format(timestamp, DATE_FORMAT)}
          </Typography>{" "}
          <Typography variant="inherit" fontWeight="bold" component="span">
            {format(timestamp, TIME_FORMAT)}
          </Typography>
          <Typography variant="inherit" color="text.secondary" component="span">
            {format(timestamp, ":ss.SSS")}
          </Typography>
        </time>

        {renderedChips.length > 0 && (
          <Stack direction="row" spacing={0.75}>
            {renderedChips}
          </Stack>
        )}

        <Typography variant="inherit" noWrap className="log-preview">
          {data.payload === "textPayload" && data.textPayload}
          {_get(data, "httpRequest.requestUrl")?.split(".run.app").pop()}
          {data.payload === "jsonPayload" && JSON.stringify(data.jsonPayload)}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <ReactJson
          src={data}
          theme={theme.palette.mode === "dark" ? "monokai" : "rjv-default"}
          iconStyle="triangle"
          style={{ font: "inherit", backgroundColor: "transparent" }}
        />
      </AccordionDetails>
    </Accordion>
  );
}
