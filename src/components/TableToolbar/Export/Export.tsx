import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import {
  query as firestoreQuery,
  Query,
  collection,
  collectionGroup,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import { DialogContent, Tab, Divider } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import { Export as ExportIcon } from "@src/assets/icons";

import Modal from "@src/components/Modal";
import ExportDetails from "./ModalContentsExport";
import DownloadDetails from "./ModalContentsDownload";

import { globalScope } from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  tableFiltersAtom,
  tableOrdersAtom,
  tableModalAtom,
} from "@src/atoms/tableScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { TableRow } from "@src/types/table";

export interface IExportModalContentsProps {
  query: Query<TableRow>;
  closeModal: () => void;
}

// TODO: Generalize and remove Firestore dependencies
export default function Export() {
  const [modal, setModal] = useAtom(tableModalAtom, tableScope);
  const open = modal === "export";
  const setOpen = (open: boolean) => setModal(open ? "export" : RESET);
  const [mode, setMode] = useState<"Export" | "Download">("Export");

  const [firebaseDb] = useAtom(firebaseDbAtom, globalScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableFilters] = useAtom(tableFiltersAtom, tableScope);
  const [tableOrders] = useAtom(tableOrdersAtom, tableScope);

  const tableCollection = tableSettings.collection;
  const isCollectionGroup = tableSettings.tableType === "collectionGroup";
  const query = useMemo(() => {
    const _path = tableCollection.replaceAll("~2F", "/") ?? "";
    let collectionRef = isCollectionGroup
      ? (collectionGroup(firebaseDb, _path) as Query<TableRow>)
      : (collection(firebaseDb, _path) as Query<TableRow>);
    // add filters
    const filters = tableFilters.map((filter) =>
      where(filter.key, filter.operator, filter.value)
    );
    // optional order results
    const orders = tableOrders.map((order) =>
      orderBy(order.key, order.direction)
    );
    // TODO: paginate
    return firestoreQuery(collectionRef, ...filters, ...orders, limit(10000));
  }, [
    firebaseDb,
    tableCollection,
    isCollectionGroup,
    tableFilters,
    tableOrders,
  ]);

  const handleClose = () => {
    setOpen(false);
    setMode("Export");
  };

  return (
    <>
      <TableToolbarButton
        title="Export/Download"
        onClick={() => setOpen(true)}
        icon={<ExportIcon />}
      />

      {open && (
        <TabContext value={mode}>
          <Modal
            onClose={handleClose}
            sx={{
              "& .MuiDialog-paper": {
                maxWidth: { sm: 440 },
                height: { sm: 640 },
              },
            }}
            title={mode}
            header={
              <>
                <DialogContent style={{ flexGrow: 0, flexShrink: 0 }}>
                  {tableFilters.length !== 0 || tableOrders.length !== 0
                    ? "The filters and sorting applied to the table will be applied to the export"
                    : "No filters or sorting will be applied on the exported data"}
                </DialogContent>

                <TabList
                  onChange={(_, v) => setMode(v)}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="Modal tabs"
                  action={(actions) =>
                    setTimeout(() => actions?.updateIndicator(), 200)
                  }
                  sx={{ mt: 1 }}
                >
                  <Tab style={{ minWidth: 0 }} label="Export" value="Export" />
                  <Tab
                    style={{ minWidth: 0 }}
                    label="Download attachments"
                    value="Download"
                  />
                </TabList>
                <Divider style={{ marginTop: -1 }} />
              </>
            }
            ScrollableDialogContentProps={{
              disableTopDivider: true,
              disableBottomDivider: true,
            }}
          >
            <TabPanel
              value="Export"
              sx={{
                marginTop: "var(--dialog-contents-spacing)",
                marginBottom: "calc(var(--dialog-spacing) * -1)",
                padding: 0,

                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height:
                  "calc(100% - var(--dialog-contents-spacing) + var(--dialog-spacing))",

                "& > * + *": {
                  marginTop: "var(--dialog-contents-spacing)",
                },
                "&[hidden]": { display: "none" },
              }}
            >
              <ExportDetails query={query} closeModal={handleClose} />
            </TabPanel>

            <TabPanel
              value="Download"
              sx={{
                marginTop: "var(--dialog-contents-spacing)",
                marginBottom: "calc(var(--dialog-spacing) * -1)",
                padding: 0,

                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height:
                  "calc(100% - var(--dialog-contents-spacing) + var(--dialog-spacing))",

                "& > * + *": {
                  marginTop: "var(--dialog-contents-spacing)",
                },
                "&[hidden]": { display: "none" },
              }}
            >
              <DownloadDetails query={query} closeModal={handleClose} />
            </TabPanel>
          </Modal>
        </TabContext>
      )}
    </>
  );
}
