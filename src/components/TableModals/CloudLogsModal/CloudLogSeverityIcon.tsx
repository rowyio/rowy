import { SvgIcon, SvgIconProps, Tooltip } from "@mui/material";
import DebugIcon from "@mui/icons-material/BugReportOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import NoticeIcon from "@mui/icons-material/NotificationsOutlined";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import { Critical as CriticalIcon } from "@src/assets/icons";
import AlertIcon from "@mui/icons-material/Error";
import EmergencyIcon from "@mui/icons-material/NewReleases";

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
export const SEVERITY_LEVELS = {
  DEFAULT: "The log entry has no assigned severity level.",
  DEBUG: "Debug or trace information.",
  INFO: "Routine information, such as ongoing status or performance.",
  NOTICE:
    "Normal but significant events, such as start up, shut down, or a configuration change.",
  WARNING: "Warning events might cause problems.",
  ERROR: "Error events are likely to cause problems.",
  CRITICAL: "Critical events cause more severe problems or outages.",
  ALERT: "A person must take an action immediately.",
  EMERGENCY: "One or more systems are unusable.",
};

export const SEVERITY_LEVELS_ROWY = {
  DEFAULT: "The log entry has no assigned severity level.",
  WARNING: "Warning events might cause problems.",
  ERROR: "Error events are likely to cause problems.",
};

export interface ICloudLogSeverityIconProps extends SvgIconProps {
  severity: keyof typeof SEVERITY_LEVELS;
}

export default function CloudLogSeverityIcon({
  severity,
  ...props
}: ICloudLogSeverityIconProps) {
  const commonIconProps: SvgIconProps = {
    ...props,
    "aria-hidden": "false",
    "aria-label": `Severity: ${severity.toLowerCase()}`,
  };

  let icon = (
    <SvgIcon {...commonIconProps} color="disabled" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="2" />
    </SvgIcon>
  );

  switch (severity) {
    case "DEBUG":
      icon = <DebugIcon {...commonIconProps} color="action" />;
      break;

    case "INFO":
      icon = <InfoIcon {...commonIconProps} color="info" />;
      break;

    case "NOTICE":
      icon = <NoticeIcon {...commonIconProps} color="info" />;
      break;

    case "WARNING":
      icon = <WarningIcon {...commonIconProps} color="warning" />;
      break;

    case "ERROR":
      icon = <ErrorIcon {...commonIconProps} color="error" />;
      break;

    case "CRITICAL":
      icon = <CriticalIcon {...commonIconProps} color="error" />;
      break;

    case "ALERT":
      icon = <AlertIcon {...commonIconProps} color="error" />;
      break;

    case "EMERGENCY":
      icon = <EmergencyIcon {...commonIconProps} color="error" />;
      break;

    default:
      break;
  }

  return (
    <Tooltip
      title={
        <>
          {severity}
          <br />
          {SEVERITY_LEVELS[severity]}
        </>
      }
      describeChild
    >
      {icon}
    </Tooltip>
  );
}
