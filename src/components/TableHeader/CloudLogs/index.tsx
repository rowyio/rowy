import { useAtom } from "jotai";

import TableHeaderButton from "../TableHeaderButton";
import LogsIcon from "@src/assets/icons/CloudLogs";
import CloudLogsModal from "./CloudLogsModal";

import { modalAtom } from "@src/atoms/Table";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { useRowyRunModal } from "@src/atoms/RowyRunModal";

export default function CloudLogs() {
  const [modal, setModal] = useAtom(modalAtom);
  const open = modal === "cloudLogs";
  const setOpen = (open: boolean) => setModal(open ? "cloudLogs" : "");

  const { settings } = useProjectContext();
  const openRowyRunModal = useRowyRunModal();

  return (
    <>
      <TableHeaderButton
        title="Cloud logs"
        icon={<LogsIcon />}
        onClick={
          settings?.rowyRunUrl
            ? () => setOpen(true)
            : () => openRowyRunModal("Cloud logs")
        }
      />

      {open && (
        <CloudLogsModal onClose={() => setOpen(false)} title="Cloud logs" />
      )}
    </>
  );
}
