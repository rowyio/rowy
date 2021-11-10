import { useAtom } from "jotai";

import TableHeaderButton from "../TableHeaderButton";
import LogsIcon from "@src/assets/icons/CloudLogs";
import CloudLogsModal from "./CloudLogsModal";

import { modalAtom } from "./utils";

export interface ICloudLogsProps {}

export default function CloudLogs(props: ICloudLogsProps) {
  const [modal, setModal] = useAtom(modalAtom);
  const open = modal === "cloudLogs";
  const setOpen = (open: boolean) => setModal(open ? "cloudLogs" : "");

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
