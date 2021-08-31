import { useState } from "react";

import TableHeaderButton from "./TableHeaderButton";
import LoopIcon from "@material-ui/icons/Loop";

import { useFiretableContext } from "contexts/FiretableContext";
import { db } from "../../../firebase";
import { isCollectionGroup } from "utils/fns";
import CircularProgress from "@material-ui/core/CircularProgress";

import { DialogContentText } from "@material-ui/core";

import Modal from "components/Modal";

export default function ReExecute() {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const { tableState } = useFiretableContext();
  const query: any = isCollectionGroup()
    ? db.collectionGroup(tableState?.tablePath!)
    : db.collection(tableState?.tablePath!);

  const handleConfirm = async () => {
    setUpdating(true);
    const _ft_forcedUpdateAt = new Date();
    const querySnapshot = await query.get();
    const docs = [...querySnapshot.docs];
    while (docs.length) {
      const batch = db.batch();
      const temp = docs.splice(0, 499);
      temp.forEach((doc) => {
        batch.update(doc.ref, { _ft_forcedUpdateAt });
      });
      await batch.commit();
    }
    setTimeout(() => {
      setUpdating(false);
      setOpen(false);
    }, 3000); // give time to for ft function to run
  };

  return (
    <>
      <TableHeaderButton
        title="Force Refresh"
        onClick={() => setOpen(true)}
        icon={<LoopIcon />}
      />

      {open && (
        <Modal
          onClose={handleClose}
          maxWidth="xs"
          fullWidth
          hideCloseButton
          title="Force Refresh?"
          children="All Extensions and Derivatives in this table will re-execute."
          actions={{
            primary: {
              children: "Confirm",
              onClick: handleConfirm,
              startIcon: updating && <CircularProgress size={16} />,
              disabled: updating,
            },
            secondary: {
              children: "Cancel",
              onClick: handleClose,
            },
          }}
        />
      )}
    </>
  );
}
