import React, { useState } from "react";
import useRouter from "hooks/useRouter";
import useTable from "hooks/useFiretable/useTable";
import { useFiretableContext } from "contexts/FiretableContext";

import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import moment from "moment";

import {
  Chip,
  CircularProgress,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
} from "@material-ui/core";
import Modal from "components/Modal";
import { makeStyles } from "@material-ui/core/styles";
import LogsIcon from "@material-ui/icons/QueryBuilder";
import SuccessIcon from "@material-ui/icons/CheckCircle";
import FailIcon from "@material-ui/icons/Cancel";
import TableHeaderButton from "./TableHeaderButton";
import Ansi from "ansi-to-react";
import EmptyState from "components/EmptyState";

import PropTypes from "prop-types";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

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
  },
  logEntryWrapper: {
    overflowY: "scroll",
    maxHeight: "100%",
  },
  logNumber: {
    float: "left",
    width: "3em",
    textAlign: "right",
    paddingRight: "1em",
  },
  logEntry: {
    lineBreak: "anywhere",
    paddingLeft: "3em",
    whiteSpace: "break-spaces",
    userSelect: "text",
  },
  logTypeInfo: {
    color: "green",
  },
  logTypeError: {
    color: "red",
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
      <Typography variant="body2" className={classes.logNumber}>
        {index}
      </Typography>
      <Typography variant="body2" className={classes.logEntry}>
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
          {logRecord.log.replaceAll("\\n", "\n").replaceAll("\\t", "\t")}
        </Ansi>
      </Typography>
    </Box>
  );
}

function LogPanel(props) {
  const { logs, status, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className={classes.logPanel}
      {...other}
    >
      {value === index && (
        <Box p={3} className={classes.logEntryWrapper}>
          {logs?.map((log, index) => {
            return <LogRow logRecord={log} index={index} />;
          })}
        </Box>
      )}
    </div>
  );
}

export default function TableLogs() {
  const router = useRouter();
  const { tableState } = useFiretableContext();

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);

  const tableCollection = decodeURIComponent(router.match.params.id);
  const ftBuildStreamID =
    "_FIRETABLE_/settings/schema/" +
    tableCollection
      .split("/")
      .filter(function (_, i) {
        // replace IDs with subTables that appears at even indexes
        return i % 2 === 0;
      })
      .join("/subTables/");

  const [collectionState] = useTable({
    path: `${ftBuildStreamID}/ftBuildLogs`,
    orderBy: [{ key: "startTimeStamp", direction: "desc" }],
  });
  const latestStatus = collectionState?.rows?.[0]?.status;

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableHeaderButton
        title="Build Logs"
        onClick={() => setOpen(true)}
        icon={
          <>
            {latestStatus === "BUILDING" && <CircularProgress size={20} />}
            {latestStatus === "SUCCESS" && <SuccessIcon />}
            {latestStatus === "FAIL" && <FailIcon />}
            {!latestStatus && <LogsIcon />}
          </>
        }
      />

      {open && !!tableState && (
        <Modal
          onClose={handleClose}
          maxWidth="xl"
          fullWidth
          title={
            <>
              Build Logs <Chip label="ALPHA" size="small" />
            </>
          }
          children={
            <>
              {!latestStatus && (
                <EmptyState
                  message="No Logs Found"
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
                    className={classes.tabs}
                  >
                    {collectionState.rows.map((logEntry, index) => (
                      <Tab
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
                  {collectionState.rows.map((logEntry, index) => (
                    <LogPanel
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
