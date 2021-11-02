import { useState } from "react";

import LogsIcon from "@src/assets/icons/CloudLogs";

import TableHeaderButton from "../TableHeaderButton";
import Modal from "@src/components/Modal";
import LogItem from "./LogItem";

export interface ICloudLogsProps {}

export default function CloudLogs(props: ICloudLogsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableHeaderButton
        title="Cloud logs"
        icon={<LogsIcon />}
        onClick={() => setOpen(true)}
      />

      {open && (
        <Modal
          onClose={() => setOpen(false)}
          maxWidth="xl"
          fullWidth
          fullHeight
          title="Cloud logs"
        >
          <LogItem />
          <LogItem />
        </Modal>
      )}
    </>
  );
}
