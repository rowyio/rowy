import { useState, useMemo } from "react";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { ITableModalProps } from "@src/components/TableModals/TableModals";
import {
  query as firestoreQuery,
  Query,
  collection,
  collectionGroup,
  orderBy,
  limit,
} from "firebase/firestore";

import { DialogContent, Tab, Divider } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Modal from "@src/components/Modal";
import ExportDetails from "./ModalContentsExport";
import DownloadDetails from "./ModalContentsDownload";

import { projectScope } from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  tableFiltersAtom,
  tableSortsAtom,
} from "@src/atoms/tableScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { tableFiltersToFirestoreFilters } from "@src/hooks/useFirestoreCollectionWithAtom";
import { TableRow } from "@src/types/table";

export interface IExportModalContentsProps {
  query: Query<TableRow>;
  closeModal: () => void;
}

// TODO: Generalize and remove Firestore dependencies
export default function Export({ onClose }: ITableModalProps) {
  const [mode, setMode] = useState<"Export" | "Download">("Export");

  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableFilters] = useAtom(tableFiltersAtom, tableScope);
  const [tableSorts] = useAtom(tableSortsAtom, tableScope);

  const tableCollection = tableSettings.collection;
  const isCollectionGroup = tableSettings.tableType === "collectionGroup";
  const query = useMemo(() => {
    const _path = tableCollection.replaceAll("~2F", "/") ?? "";
    let collectionRef = isCollectionGroup
      ? (collectionGroup(firebaseDb, _path) as Query<TableRow>)
      : (collection(firebaseDb, _path) as Query<TableRow>);
    // add filters
    const filters = tableFiltersToFirestoreFilters(tableFilters);
    // optional order results
    const sorts = tableSorts.map((order) =>
      orderBy(order.key, order.direction)
    );
    // TODO: paginate
    return firestoreQuery(collectionRef, ...filters, ...sorts, limit(10_000));
  }, [
    firebaseDb,
    tableCollection,
    isCollectionGroup,
    tableFilters,
    tableSorts,
  ]);

  return (
    <TabContext value={mode}>
      <Modal
        onClose={onClose}
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
              {tableFilters.length !== 0 || tableSorts.length !== 0
                ? "The filters and sorting applied to the table will be applied to the export"
                : "No filters or sorting will be applied on the exported data"}
              . Limited to 10,000 rows.
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
          <ExportDetails query={query} closeModal={onClose} />
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
          <DownloadDetails query={query} closeModal={onClose} />
        </TabPanel>
      </Modal>
    </TabContext>
  );
}
