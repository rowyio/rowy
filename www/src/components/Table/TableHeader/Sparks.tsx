import React, { useState, useContext } from "react";
import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import { useConfirmation } from "components/ConfirmationDialog";

import {
  makeStyles,
  createStyles,
  Tooltip,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Dialog,
} from "@material-ui/core";

import SparkIcon from "@material-ui/icons/OfflineBolt";

import { SnackContext } from "contexts/SnackContext";
import { useFiretableContext } from "contexts/FiretableContext";
import CodeEditor from "../editors/CodeEditor";
import { triggerCloudBuild } from "../../../firebase/callables";
const useStyles = makeStyles(() =>
  createStyles({
    button: {
      padding: 0,
      minWidth: 32,
    },
  })
);

export default function SparksEditor() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const { tableState, tableActions } = useFiretableContext();
  const snackContext = useContext(SnackContext);
  const { requestConfirmation } = useConfirmation();
  const currentSparks = tableState?.config.sparks ?? "";
  const [localSparks, setLocalSparks] = useState(currentSparks);
  const handleClose = () => {
    if (currentSparks !== localSparks) {
      requestConfirmation({
        title: "Discard Changes",
        body: "You will lose changes you have made to this spark",
        confirm: "Discard",
        handleConfirm: () => {
          setOpen(false);
          setLocalSparks(currentSparks);
        },
      });
    } else setOpen(false);
  };

  const handleSave = () => {
    tableActions?.table.updateConfig("sparks", localSparks);
    setOpen(false);
    requestConfirmation({
      title: "Deploy Changes",
      body: "Would you like to redeploy the cloud function for this table now?",
      confirm: "Deploy",
      cancel: "later",
      handleConfirm: async () => {
        const response = await triggerCloudBuild(
          tableState?.config.tableConfig.path
        );
        console.log(response);
      },
    });
  };

  return (
    <>
      <Tooltip title="Edit sparks">
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          color="secondary"
          aria-label="Sparks"
          className={classes.button}
        >
          <SparkIcon />
        </Button>
      </Tooltip>

      <Dialog
        open={open && !!tableState}
        onClose={handleClose}
        aria-labelledby="sparks-dialog"
        aria-describedby="edit table sparks"
        maxWidth={"xl"}
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          Edit {tableState?.tablePath} sparks
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="form-dialog-description">
            array of sparks that will evaluate and run onWrite events
          </DialogContentText>

          <CodeEditor
            script={currentSparks}
            handleChange={(newValue) => {
              setLocalSparks(newValue);
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={localSparks === tableState?.config.sparks}
            color="primary"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
