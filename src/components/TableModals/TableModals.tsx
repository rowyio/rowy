import { lazy } from "react";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { tableScope, tableModalAtom } from "@src/atoms/tableScope";

// prettier-ignore
const CloudLogsModal = lazy(() => import("./CloudLogsModal" /* webpackChunkName: "TableModals-CloudLogsModal" */));
// prettier-ignore
const ExtensionsModal = lazy(() => import("./ExtensionsModal" /* webpackChunkName: "TableModals-ExtensionsModal" */));
// prettier-ignore
const WebhooksModal = lazy(() => import("./WebhooksModal" /* webpackChunkName: "TableModals-WebhooksModal" */));
// prettier-ignore
const ImportWizard = lazy(() => import("./ImportWizard" /* webpackChunkName: "TableModals-ImportWizard" */));
// prettier-ignore
const ImportCsvWizard = lazy(() => import("./ImportCsvWizard" /* webpackChunkName: "TableModals-ImportCsvWizard" */));

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
  if (tableModal === "import") return <ImportWizard onClose={onClose} />;
  if (tableModal === "importCsv") return <ImportCsvWizard onClose={onClose} />;

  return null;
}
