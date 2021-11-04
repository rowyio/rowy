import { useAtom } from "jotai";
import { atomWithHash } from "jotai/utils";

import TableHeaderButton from "../TableHeaderButton";
import LogsIcon from "@src/assets/icons/CloudLogs";
import CloudLogsModal from "./CloudLogsModal";

const modalAtom = atomWithHash("modal", "");
// const modalStateAtom = atomWithHash<Record<string, any>>("modalState", {});

export interface ICloudLogsProps {}

export default function CloudLogs(props: ICloudLogsProps) {
  const [modal, setModal] = useAtom(modalAtom);
  const open = modal === "cloudLogs";
  const setOpen = (open: boolean) => setModal(open ? "cloudLogs" : "");

  // const [modalState, setModalState] = useAtom(modalStateAtom);

  return (
    <>
      <TableHeaderButton
        title="Cloud logs"
        icon={<LogsIcon />}
        onClick={() => setOpen(true)}
      />

      {open && (
        <CloudLogsModal onClose={() => setOpen(false)} title="Cloud logs" />
      )}
    </>
  );
}
