import React, { useState } from "react";
import useRouter from "hooks/useRouter";
import useTable from "hooks/useFiretable/useTable";
import { useFiretableContext } from "contexts/FiretableContext";

import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import moment from "moment";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Chip } from "@material-ui/core";
import Modal from "components/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import LogsIcon from "@material-ui/icons/QueryBuilder";
import TableHeaderButton from "./TableHeaderButton";
import Ansi from "ansi-to-react";

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
    height: "80vh",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
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
}));

LogPanel.propTypes = {
  logs: PropTypes.array,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function LogRow({ logString, index }) {
  const classes = useStyles();

  return (
    <Box>
      <Typography variant="body2" className={classes.logNumber}>
        {index}
      </Typography>
      <Typography variant="body2" className={classes.logEntry}>
        <Ansi>{logString.replaceAll("\\n", "\n").replaceAll("\\t", "\t")}</Ansi>
      </Typography>
    </Box>
  );
}

function LogPanel(props) {
  const { logs, value, index, ...other } = props;
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
            return <LogRow logString={log} index={index} />;
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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableHeaderButton
        title="Table Logs"
        onClick={() => setOpen(true)}
        icon={<LogsIcon />}
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
              <div className={classes.root}>
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={tabIndex}
                  onChange={handleTabChange}
                  className={classes.tabs}
                >
                  {collectionState.rows.map((value, index) => (
                    <Tab
                      label={moment(value.startTimeStamp).format(
                        "MMMM D YYYY h:mm:ssa"
                      )}
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>
                {collectionState.rows.map((logEntry, index) => (
                  <LogPanel
                    value={tabIndex}
                    index={index}
                    logs={logEntry?.fullLog}
                  />
                ))}
              </div>
            </>
          }
        />
      )}
    </>
  );
}
