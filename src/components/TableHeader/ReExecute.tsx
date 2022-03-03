import { useState } from "react";

import TableHeaderButton from "./TableHeaderButton";
import LoopIcon from "@mui/icons-material/Loop";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { db } from "../../firebase";
import { isCollectionGroup } from "@src/utils/fns";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import Modal from "@src/components/Modal";
import { useRowyRunModal } from "@src/atoms/RowyRunModal";

export default function ReExecute() {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const { tableState, settings } = useProjectContext();

  const openRowyRunModal = useRowyRunModal();
  if (!settings?.rowyRunUrl)
    return (
      <TableHeaderButton
        title="Force refresh"
        onClick={() => openRowyRunModal()}
        icon={<LoopIcon />}
      />
    );

  const query: any = isCollectionGroup()
    ? db.collectionGroup(tableState?.tablePath!)
    : db.collection(tableState?.tablePath!);

  const handleConfirm = async () => {
    setUpdating(true);
    const _forcedUpdateAt = new Date();
    const querySnapshot = await query.get();
    const docs = [...querySnapshot.docs];
    while (docs.length) {
      const batch = db.batch();
      const temp = docs.splice(0, 499);
      temp.forEach((doc) => {
        batch.update(doc.ref, { _forcedUpdateAt });
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
        title="Force refresh"
        onClick={() => setOpen(true)}
        icon={<LoopIcon />}
      />

      {open && (
        <Modal
          onClose={handleClose}
          maxWidth="xs"
          fullWidth
          hideCloseButton
          title="Force refresh?"
          children="All Extensions and Derivatives in this table will re-execute."
          actions={{
            primary: {
              children: "Confirm",
              onClick: handleConfirm,
              startIcon: updating && <CircularProgressOptical size={16} />,
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
