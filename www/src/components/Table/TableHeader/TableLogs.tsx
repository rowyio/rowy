import React, { useEffect, useRef, useState } from "react";
import useRouter from "hooks/useRouter";
import useCollection from "hooks/useCollection";
import { useFiretableContext } from "contexts/FiretableContext";
import useStateRef from "react-usestateref";
import { db } from "../../../firebase";
import { useSnackLogContext } from "contexts/SnackLogContext";
import { isCollectionGroup } from "utils/fns";

import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import _throttle from "lodash/throttle";
import moment from "moment";

import {
  Chip,
  CircularProgress,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  Link,
} from "@material-ui/core";
import Modal from "components/Modal";
import { makeStyles } from "@material-ui/core/styles";
import LogsIcon from "@material-ui/icons/QueryBuilder";
import SuccessIcon from "@material-ui/icons/CheckCircle";
import FailIcon from "@material-ui/icons/Cancel";
import ExpandIcon from "@material-ui/icons/ExpandLess";
import CollapseIcon from "@material-ui/icons/ExpandMore";
import OpenIcon from "@material-ui/icons/OpenInNew";
import CloseIcon from "@material-ui/icons/Close";
import TableHeaderButton from "./TableHeaderButton";
import { LOG_FONT, LOG_TEXT } from "Themes";
import Ansi from "ansi-to-react";
import EmptyState from "components/EmptyState";

import PropTypes from "prop-types";
import WIKI_LINKS from "constants/wikiLinks";

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: `calc(100vh - 200px)`,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab: {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyItems: "center",
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
    fontSize: 16,
    fontFamily: LOG_FONT,
    letterSpacing: 0.5,
    lineHeight: 1.5,
    color: LOG_TEXT,

    "& code": {
      fontFamily: LOG_FONT,
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
}));

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
  const { logs, status, value, index, isOpen, ...other } = props;
  const classes = useStyles();

  // useStateRef is necessary to resolve the state syncing issue
  // https://stackoverflow.com/a/63039797/12208834
  const [liveStreaming, setLiveStreaming, liveStreamingStateRef] = useStateRef(
    true
  );
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
  const [liveStreaming, setLiveStreaming, liveStreamingStateRef] = useStateRef(
    true
  );
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
          {!log && <span className={classes.whiteText}>Build Pending...</span>}
          {log?.status === "SUCCESS" && (
            <span
              style={{
                color: "#aed581",
              }}
            >
              Build Completed
            </span>
          )}
          {log?.status === "FAIL" && (
            <span
              style={{
                color: "#e57373",
              }}
            >
              Build Failed
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
  const { tableState } = useFiretableContext();

  const classes = useStyles();
  const [panalOpen, setPanelOpen] = useState(false);
  const [buildURLConfigured, setBuildURLConfigured] = useState(true);
  const [tabIndex, setTabIndex] = React.useState(0);
  const snackLogContext = useSnackLogContext();

  useEffect(() => {
    checkBuildURL();
  }, []);

  const checkBuildURL = async () => {
    const settingsDoc = await db.doc("/_FIRETABLE_/settings").get();
    const ftBuildUrl = settingsDoc.get("ftBuildUrl");
    if (!ftBuildUrl) {
      setBuildURLConfigured(false);
    }
  };

  const tableCollection = decodeURIComponent(router.match.params.id);
  const ftBuildStreamID =
    "_FIRETABLE_/settings/" +
    `${isCollectionGroup() ? "groupSchema/" : "schema/"}` +
    tableCollection
      .split("/")
      .filter(function (_, i) {
        // replace IDs with subTables that appears at even indexes
        return i % 2 === 0;
      })
      .join("/subTables/");

  const [collectionState] = useCollection({
    path: `${ftBuildStreamID}/ftBuildLogs`,
    orderBy: [{ key: "startTimeStamp", direction: "desc" }],
    limit: 30,
  });
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
        title="Build Logs"
        onClick={() => setPanelOpen(true)}
        icon={
          <>
            {latestStatus === "BUILDING" && <CircularProgress size={20} />}
            {latestStatus === "SUCCESS" && <SuccessIcon />}
            {latestStatus === "FAIL" && <FailIcon />}
            {!latestStatus && <LogsIcon />}
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
          title={
            <>
              Build Logs <Chip label="ALPHA" size="small" />
            </>
          }
          children={
            <>
              {!latestStatus && buildURLConfigured && (
                <EmptyState
                  message="No Logs Found"
                  description={
                    "When you start building, your logs should be shown here shortly"
                  }
                />
              )}
              {!latestStatus && !buildURLConfigured && (
                <EmptyState
                  message="Need Configuration"
                  description={
                    <>
                      Cloud Run trigger URL not configured.
                      <Link
                        href={WIKI_LINKS.cloudRunFtBuilder}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        underline="always"
                      >
                        Configuration guide
                      </Link>
                    </>
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
                    className={classes.tabs}
                  >
                    {collectionState.documents?.map((logEntry, index) => (
                      <Tab
                        key={index}
                        label={
                          <Box className={classes.tab}>
                            <Box>
                              {moment(logEntry.startTimeStamp).format(
                                "MMMM D YYYY h:mm:ssa"
                              )}
                            </Box>
                            <Box>
                              {logEntry.status === "BUILDING" && (
                                <CircularProgress size={24} />
                              )}
                              {logEntry.status === "SUCCESS" && <SuccessIcon />}
                              {logEntry.status === "FAIL" && <FailIcon />}
                            </Box>
                          </Box>
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
