import { useState } from "react";

import TableHeaderButton from "./TableHeaderButton";
import LoopIcon from "@material-ui/icons/Loop";

import { useFiretableContext } from "contexts/FiretableContext";
import { db } from "../../../firebase";
import { isCollectionGroup } from "utils/fns";
import CircularProgress from "@material-ui/core/CircularProgress";

import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";

import { makeStyles, createStyles, DialogContentText } from "@material-ui/core";

import Modal from "components/Modal";

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      [theme.breakpoints.up("sm")]: {
        maxWidth: 500,
      },
    },
    spinner: { marginRight: theme.spacing(1) },
  })
);

export default function ReExecute() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  //
  const { tableState } = useFiretableContext();
  const query: any = isCollectionGroup()
    ? db.collectionGroup(tableState?.tablePath!)
    : db.collection(tableState?.tablePath!);

  const handleConfirm = async () => {
    setUpdating(true);
    const _ft_forcedUpdateAt = new Date();
    const batch = db.batch();
    const querySnapshot = await query.get();
    querySnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { _ft_forcedUpdateAt });
    });
    await batch.commit();
    setUpdating(false);
    setTimeout(() => setOpen(false), 3000); // give time to for ft function to run
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
          classes={{ paper: classes.paper }}
          title={"Confirm Force Refresh"}
          header={
            <>
              <DialogContentText>
                Are you sure you want to force a re-execute of all Sparks and
                Derivatives?
              </DialogContentText>
            </>
          }
          actions={{
            primary: {
              children: "Confirm",
              onClick: handleConfirm,
              startIcon: updating && (
                <CircularProgress className={classes.spinner} size={16} />
              ),
              disabled: updating,
            },
            secondary: {
              children: "Cancel",
              onClick: handleClose,
            },
          }}
        ></Modal>
      )}
    </>
  );
}
