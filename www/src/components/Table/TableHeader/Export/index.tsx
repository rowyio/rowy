import { useState, useMemo } from "react";
import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";

import {
  makeStyles,
  createStyles,
  DialogContentText,
  Tab,
  Divider,
} from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";

import TableHeaderButton from "../TableHeaderButton";
import ExportIcon from "assets/icons/Export";

import Modal from "components/Modal";
import ExportDetails from "./Export";
import DownloadDetails from "./Download";

import { useFiretableContext } from "contexts/FiretableContext";
import { db } from "../../../../firebase";
import { isCollectionGroup } from "utils/fns";

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      [theme.breakpoints.up("sm")]: {
        maxWidth: 500,
        height: 620,
      },
    },

    tabs: {
      marginLeft: "calc(var(--spacing-modal) * -1)",
      marginRight: "calc(var(--spacing-modal) * -1)",
    },
    tab: { minWidth: 0 },
    divider: {
      margin: "-1px calc(var(--spacing-modal) * -1) 0",
    },

    tabPanel: {
      marginTop: "var(--spacing-modal-contents)",
      padding: 0,

      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      height: "calc(100% - var(--spacing-modal-contents))",

      "& > * + *": { marginTop: "var(--spacing-modal-contents)" },
      "&[hidden]": { display: "none" },
    },
  })
);

export default function Export() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"Export" | "Download">("Export");
  const { tableState } = useFiretableContext();

  const query: any = useMemo(() => {
    let _query = isCollectionGroup()
      ? db.collectionGroup(tableState?.tablePath!)
      : db.collection(tableState?.tablePath!);
    // add filters
    tableState?.filters.forEach((filter) => {
      _query = _query.where(
        filter.key,
        filter.operator as firebase.default.firestore.WhereFilterOp,
        filter.value
      );
    });
    // optional order results
    if (tableState?.orderBy) {
      tableState?.orderBy?.forEach((orderBy) => {
        _query = _query.orderBy(orderBy.key, orderBy.direction);
      });
    }
    return _query.limit(10000);
  }, [tableState?.tablePath, tableState?.orderBy, tableState?.filters]);

  const handleClose = () => {
    setOpen(false);
    setMode("Export");
  };

  return (
    <>
      <TableHeaderButton
        title="Export/Download"
        onClick={() => setOpen(true)}
        icon={<ExportIcon />}
      />

      {open && (
        <TabContext value={mode}>
          <Modal
            onClose={handleClose}
            classes={{ paper: classes.paper }}
            title={mode}
            header={
              <>
                <DialogContentText>
                  {(tableState?.filters && tableState?.filters.length !== 0) ||
                  (tableState?.orderBy && tableState?.orderBy.length !== 0)
                    ? "The filters and sorting applied to the table will be used in the export"
                    : "No filters or sorting will be applied on the exported data"}
                </DialogContentText>

                <TabList
                  className={classes.tabs}
                  onChange={(_, v) => setMode(v)}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="Modal tabs"
                  action={(actions) =>
                    setTimeout(() => actions?.updateIndicator(), 200)
                  }
                >
                  <Tab className={classes.tab} label="Export" value="Export" />
                  <Tab
                    className={classes.tab}
                    label="Download Attachments"
                    value="Download"
                  />
                </TabList>
                <Divider className={classes.divider} />
              </>
            }
          >
            <TabPanel value="Export" className={classes.tabPanel}>
              <ExportDetails query={query} closeModal={handleClose} />
            </TabPanel>

            <TabPanel value="Download" className={classes.tabPanel}>
              <DownloadDetails query={query} closeModal={handleClose} />
            </TabPanel>
          </Modal>
        </TabContext>
      )}
    </>
  );
}
