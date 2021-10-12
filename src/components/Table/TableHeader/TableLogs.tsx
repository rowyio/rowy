import React, { useEffect, useRef, useState } from "react";
import useRouter from "hooks/useRouter";
import useCollection from "hooks/useCollection";
import { useProjectContext } from "contexts/ProjectContext";
import useStateRef from "react-usestateref";
import { useSnackLogContext } from "contexts/SnackLogContext";
import { isCollectionGroup } from "utils/fns";
import _throttle from "lodash/throttle";
import { format } from "date-fns";
import moment from "moment";

import {
  Chip,
  Stack,
  CircularProgress,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  Button,
} from "@mui/material";
import Modal from "components/Modal";
import { makeStyles, createStyles } from "@mui/styles";
import LogsIcon from "assets/icons/CloudLogs";
import SuccessIcon from "@mui/icons-material/CheckCircle";
import FailIcon from "@mui/icons-material/Cancel";
import ExpandIcon from "@mui/icons-material/ExpandLess";
import CollapseIcon from "@mui/icons-material/ExpandMore";
import OpenIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import TableHeaderButton from "./TableHeaderButton";
import Ansi from "ansi-to-react";
import EmptyState from "components/EmptyState";

import PropTypes from "prop-types";
import routes from "constants/routes";
import { DATE_TIME_FORMAT } from "constants/dates";
import { SETTINGS, TABLE_SCHEMAS, TABLE_GROUP_SCHEMAS } from "config/dbPaths";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const isTargetInsideBox = (target, box) => {
  const targetRect = target.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();
  return targetRect.y < boxRect.y + boxRect.height;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    toolbarStatusIcon: {
      fontSize: 12,

      position: "absolute",
      bottom: 2,
      right: 5,

      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
      borderRadius: "50%",
    },

    root: {
      display: "flex",
      height: "100%",
    },

    logPanel: {
      width: "100%",
      backgroundColor: "#1E1E1E",
    },
    logPanelProgress: {
      marginLeft: "2em",
      marginTop: "1em",
    },
    logEntryWrapper: {
      overflowY: "scroll",
      maxHeight: "100%",
    },
    logNumber: {
      float: "left",
      width: "2em",
      textAlign: "right",
      paddingRight: "1em",
    },
    logEntry: {
      lineBreak: "anywhere",
      paddingLeft: "2em",
      whiteSpace: "break-spaces",
      userSelect: "text",
    },
    logTypeInfo: {
      color: "green",
    },
    logTypeError: {
      color: "red",
    },
    logFont: {
      ...theme.typography.body2,
      fontFamily: theme.typography.fontFamilyMono,
      // TODO:
      color: "#CCC",

      "& code": {
        fontFamily: theme.typography.fontFamilyMono,
      },
    },

    snackLog: {
      position: "absolute",
      left: 40,
      bottom: 40,
      backgroundColor: "#282829",
      width: "min(40vw, 640px)",
      padding: theme.spacing(1, 2, 2, 2),
      borderRadius: 4,
      zIndex: 1,
      height: 300,
      transition: "height 300ms ease-out",
    },
    snackLogExpanded: {
      height: "calc(100% - 300px)",
    },

    whiteText: {
      color: "white",
    },
  })
);

LogPanel.propTypes = {
  logs: PropTypes.array,
  status: PropTypes.string,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function LogRow({ logRecord, index }) {
  const classes = useStyles();

  return (
    <Box>
      <Typography
        variant="body2"
        className={`${classes.logNumber} ${classes.logFont}`}
      >
        {index}
      </Typography>
      <Typography
        variant="body2"
        className={`${classes.logEntry} ${classes.logFont}`}
      >
        <Ansi
          className={
            logRecord.level === "info"
              ? classes.logTypeInfo
              : classes.logTypeError
          }
        >
          {moment(logRecord.timestamp).format("LTS")}
        </Ansi>
        {"  "}
        <Ansi>
          {logRecord.log
            .replaceAll("\\n", "\n")
            .replaceAll("\\t", "\t")
            .replaceAll("\\", "")}
        </Ansi>
      </Typography>
    </Box>
  );
}

function LogPanel(props) {
  const { logs, status, value, index, ...other } = props;
  const classes = useStyles();

  // useStateRef is necessary to resolve the state syncing issue
  // https://stackoverflow.com/a/63039797/12208834
  const [liveStreaming, setLiveStreaming, liveStreamingStateRef] =
    useStateRef(true);
  const liveStreamingRef = useRef<any>();
  const isActive = value === index;

  const handleScroll = _throttle(() => {
    const target = document.querySelector("#live-stream-target");
    const scrollBox = document.querySelector("#live-stream-scroll-box");
    const liveStreamTargetVisible = isTargetInsideBox(target, scrollBox);
    if (liveStreamTargetVisible !== liveStreamingStateRef.current) {
      setLiveStreaming(liveStreamTargetVisible);
    }
  }, 500);

  const scrollToLive = () => {
    const liveStreamTarget = document.querySelector("#live-stream-target");
    liveStreamTarget?.scrollIntoView?.({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (liveStreaming && isActive && status === "BUILDING") {
      if (!liveStreamingRef.current) {
        scrollToLive();
      } else {
        setTimeout(scrollToLive, 100);
      }
    }
  }, [logs, value]);

  useEffect(() => {
    if (isActive) {
      const liveStreamScrollBox = document.querySelector(
        "#live-stream-scroll-box"
      );
      liveStreamScrollBox!.addEventListener("scroll", () => {
        handleScroll();
      });
    }
  }, [value]);

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className={classes.logPanel}
      {...other}
    >
      {value === index && (
        <Box
          p={3}
          className={classes.logEntryWrapper}
          id="live-stream-scroll-box"
        >
          {logs?.map((log, index) => {
            return <LogRow logRecord={log} index={index} key={index} />;
          })}
          <div ref={liveStreamingRef} id="live-stream-target">
            {status === "BUILDING" && (
              <CircularProgress
                className={classes.logPanelProgress}
                size={30}
              />
            )}
          </div>
          <div style={{ height: 10 }} />
        </Box>
      )}
    </div>
  );
}

function SnackLog({ log, onClose, onOpenPanel }) {
  const logs = log?.fullLog;
  const status = log?.status;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [liveStreaming, setLiveStreaming, liveStreamingStateRef] =
    useStateRef(true);
  const liveStreamingRef = useRef<any>();

  const handleScroll = _throttle(() => {
    const target = document.querySelector("#live-stream-target-snack");
    const scrollBox = document.querySelector("#live-stream-scroll-box-snack");
    const liveStreamTargetVisible =
      target && scrollBox && isTargetInsideBox(target, scrollBox);
    if (liveStreamTargetVisible !== liveStreamingStateRef.current) {
      setLiveStreaming(liveStreamTargetVisible);
    }
  }, 100);

  const scrollToLive = () => {
    const liveStreamTarget = document.querySelector(
      "#live-stream-target-snack"
    );
    liveStreamTarget?.scrollIntoView?.();
  };

  useEffect(() => {
    if (liveStreaming && status === "BUILDING") {
      if (!liveStreamingRef.current) {
        scrollToLive();
      } else {
        setTimeout(scrollToLive, 500);
      }
    }
  }, [log]);

  useEffect(() => {
    const liveStreamScrollBox = document.querySelector(
      "#live-stream-scroll-box-snack"
    );
    liveStreamScrollBox!.addEventListener("scroll", () => {
      handleScroll();
    });
  }, []);

  return (
    <Box
      className={`${classes.snackLog} ${expanded && classes.snackLogExpanded}`}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="overline">
          {!log && <span className={classes.whiteText}>Build pending…</span>}
          {log?.status === "SUCCESS" && (
            <span
              style={{
                color: "#aed581",
              }}
            >
              Build completed
            </span>
          )}
          {log?.status === "FAIL" && (
            <span
              style={{
                color: "#e57373",
              }}
            >
              Build failed
            </span>
          )}
          {log?.status === "BUILDING" && (
            <span className={classes.whiteText}>Building...</span>
          )}
        </Typography>
        <Box>
          <IconButton
            className={classes.whiteText}
            aria-label="expand"
            size="small"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
          <IconButton
            className={classes.whiteText}
            aria-label="open"
            size="small"
            onClick={onOpenPanel}
          >
            <OpenIcon />
          </IconButton>
          <IconButton
            className={classes.whiteText}
            aria-label="close"
            size="small"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        className={classes.logEntryWrapper}
        height={"calc(100% - 25px)"}
        id="live-stream-scroll-box-snack"
      >
        {log && (
          <>
            {logs?.map((log, index) => {
              return <LogRow logRecord={log} index={index} key={index} />;
            })}
            <div ref={liveStreamingRef} id="live-stream-target-snack">
              {status === "BUILDING" && (
                <CircularProgress
                  className={classes.logPanelProgress}
                  size={30}
                />
              )}
            </div>
            <div style={{ height: 10 }} />
          </>
        )}
      </Box>
    </Box>
  );
}

export default function TableLogs() {
  const router = useRouter();
  const { tableState } = useProjectContext();
  const classes = useStyles();
  const [panalOpen, setPanelOpen] = useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const snackLogContext = useSnackLogContext();
  const functionConfigPath = tableState?.config.functionConfigPath;
  // console.log(functionConfigPath);

  const [collectionState, collectionDispatch] = useCollection({});
  useEffect(() => {
    if (functionConfigPath) {
      const path = `${functionConfigPath}/buildLogs`;
      // console.log(path);
      collectionDispatch({
        path,
        orderBy: [{ key: "startTimeStamp", direction: "desc" }],
        limit: 30,
      });
    }
  }, [functionConfigPath]);
  const latestLog = collectionState?.documents?.[0];
  const latestStatus = latestLog?.status;
  const latestActiveLog =
    latestLog?.startTimeStamp > snackLogContext.latestBuildTimestamp
      ? latestLog
      : null;

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <TableHeaderButton
        title="Build logs"
        onClick={() => setPanelOpen(true)}
        icon={
          <>
            <LogsIcon />
            {latestStatus === "BUILDING" && (
              <CircularProgress
                className={classes.toolbarStatusIcon}
                size={12}
                thickness={6}
                style={{ padding: 1 }}
              />
            )}
            {latestStatus === "SUCCESS" && (
              <SuccessIcon
                color="success"
                className={classes.toolbarStatusIcon}
              />
            )}
            {latestStatus === "FAIL" && (
              <FailIcon color="error" className={classes.toolbarStatusIcon} />
            )}
          </>
        }
      />

      {snackLogContext.isSnackLogOpen && (
        <SnackLog
          log={latestActiveLog}
          onClose={snackLogContext.closeSnackLog}
          onOpenPanel={() => {
            setPanelOpen(true);
          }}
        />
      )}

      {panalOpen && !!tableState && (
        <Modal
          onClose={() => {
            setPanelOpen(false);
          }}
          maxWidth="xl"
          fullWidth
          fullHeight
          title={
            <>
              Build logs <Chip label="ALPHA" size="small" />
            </>
          }
          children={
            <>
              {!latestStatus && (
                <EmptyState
                  message="No logs found"
                  description={
                    "When you start building, your logs should be shown here shortly"
                  }
                />
              )}
              {latestStatus && (
                <div className={classes.root}>
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tabIndex}
                    onChange={handleTabChange}
                  >
                    {collectionState.documents?.map((logEntry, index) => (
                      <Tab
                        key={index}
                        label={
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            style={{ textAlign: "left" }}
                          >
                            {logEntry.status === "BUILDING" && (
                              <CircularProgress size={24} />
                            )}
                            {logEntry.status === "SUCCESS" && <SuccessIcon />}
                            {logEntry.status === "FAIL" && <FailIcon />}

                            <div
                              style={{
                                fontFeatureSettings: "'tnum'",
                                width: 100,
                              }}
                            >
                              {format(
                                logEntry.startTimeStamp,
                                DATE_TIME_FORMAT
                              )}
                            </div>
                          </Stack>
                        }
                        {...a11yProps(index)}
                      />
                    ))}
                  </Tabs>
                  {collectionState.documents.map((logEntry, index) => (
                    <LogPanel
                      key={index}
                      value={tabIndex}
                      index={index}
                      logs={logEntry?.fullLog}
                      status={logEntry?.status}
                    />
                  ))}
                </div>
              )}
            </>
          }
        />
      )}
    </>
  );
}
