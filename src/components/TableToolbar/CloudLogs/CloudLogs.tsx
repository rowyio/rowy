import { useAtom, useSetAtom } from "jotai";

import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import { CloudLogs as LogsIcon } from "@src/assets/icons";
import CloudLogsModal from "./CloudLogsModal";

import {
  globalScope,
  projectSettingsAtom,
  rowyRunModalAtom,
  tableModalAtom,
} from "@src/atoms/globalScope";

export default function CloudLogs() {
  const [projectSettings] = useAtom(projectSettingsAtom, globalScope);
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, globalScope);
  const [modal, setModal] = useAtom(tableModalAtom, globalScope);

  const open = modal === "cloudLogs";
  const setOpen = (open: boolean) => setModal(open ? "cloudLogs" : null);

  return (
    <>
      <TableToolbarButton
        title="Cloud logs"
        icon={<LogsIcon />}
        onClick={
          projectSettings.rowyRunUrl
            ? () => setOpen(true)
            : () => openRowyRunModal({ feature: "Cloud logs" })
        }
      />

      {open && (
        <CloudLogsModal onClose={() => setOpen(false)} title="Cloud logs" />
      )}
    </>
  );
}
