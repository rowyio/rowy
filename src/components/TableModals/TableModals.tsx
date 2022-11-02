import { lazy } from "react";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { tableScope, tableModalAtom } from "@src/atoms/tableScope";

// prettier-ignore
const CloudLogsModal = lazy(() => import("./CloudLogsModal" /* webpackChunkName: "TableModals-CloudLogsModal" */));
// prettier-ignore
const ExtensionsModal = lazy(() => import("./ExtensionsModal" /* webpackChunkName: "TableModals-ExtensionsModal" */));
// prettier-ignore
const ExportModal = lazy(() => import("./ExportModal" /* webpackChunkName: "TableModals-ExportModal" */));
// prettier-ignore
const WebhooksModal = lazy(() => import("./WebhooksModal" /* webpackChunkName: "TableModals-WebhooksModal" */));
// prettier-ignore
const ImportExistingWizard = lazy(() => import("./ImportExistingWizard" /* webpackChunkName: "TableModals-ImportExistingWizard" */));
// prettier-ignore
const ImportCsvWizard = lazy(() => import("./ImportCsvWizard" /* webpackChunkName: "TableModals-ImportCsvWizard" */));
// prettier-ignore
const ImportAirtableWizard = lazy(() => import("./ImportAirtableWizard" /* webpackChunkName: "TableModals-ImportAirtableWizard" */));

export interface ITableModalProps {
  onClose: () => void;
}

export default function TableModals() {
  const [tableModal, setTableModal] = useAtom(tableModalAtom, tableScope);

  if (!tableModal) return null;

  const onClose = () => setTableModal(RESET);

  if (tableModal === "cloudLogs") return <CloudLogsModal onClose={onClose} />;
  if (tableModal === "extensions") return <ExtensionsModal onClose={onClose} />;
  if (tableModal === "webhooks") return <WebhooksModal onClose={onClose} />;
  if (tableModal === "export") return <ExportModal onClose={onClose} />;
  if (tableModal === "importExisting")
    return <ImportExistingWizard onClose={onClose} />;
  if (tableModal === "importCsv") return <ImportCsvWizard onClose={onClose} />;
  if (tableModal === "importAirtable")
    return <ImportAirtableWizard onClose={onClose} />;

  return null;
}
