import React, { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";

import AddIcon from "@material-ui/icons/Add";
import useRouter from "../hooks/useRouter";
import MultiSelect from "../components/MultiSelect";
import {
  Tooltip,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Select,
} from "@material-ui/core";
import { useFiretableContext } from "../contexts/firetableContext";

export interface ICreateTableDialogProps {
  /** Optional class overrides */
  classes?: Partial<Record<"fab", string>>;
  /** Function to handle table creation */
  createTable: (tableName: string, collectionName: string) => void;
}

export default function CreateTableDialog({
  classes = {},
  createTable,
}: ICreateTableDialogProps) {
  const router = useRouter();
  const { userClaims } = useFiretableContext();
  const [open, setOpen] = React.useState(false);
  const [tableName, setTableName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  useEffect(() => {
    setCollectionName(_camelCase(tableName));
  }, [tableName]);
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setTableName("");
    setCollectionName("");
    setOpen(false);
  }
  function handleCreate() {
    createTable(tableName, collectionName);
    if (router.location.pathname === "/") {
      router.history.push(`table/${collectionName}`);
    } else {
      router.history.push(collectionName);
    }

    handleClose();
  }
  if (userClaims && userClaims.roles?.includes("ADMIN"))
    return (
      <div>
        <Tooltip title="Create a table">
          <Fab
            className={classes.fab}
            color="secondary"
            aria-label="Create table"
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">New table</DialogTitle>
          <DialogContent>
            <DialogContentText>Create a new Table</DialogContentText>
            <Select label="Section" />
            <TextField
              autoFocus
              onChange={e => {
                setTableName(e.target.value);
              }}
              margin="dense"
              id="name"
              label="Table Name"
              type="text"
              fullWidth
              variant="filled"
            />
            <TextField
              value={collectionName}
              onChange={e => {
                setCollectionName(e.target.value);
              }}
              variant="filled"
              margin="dense"
              id="collection"
              label="Collection Name"
              type="text"
              fullWidth
            />

            <TextField
              label="Description"
              id="description"
              variant="filled"
              fullWidth
              multiline={true}
            />
            <MultiSelect
              freeText={true}
              options={["PROGRAM", "RECRUITING", "COACHING", "ADMIN"]}
              multiple
              value={[]}
              selectAll
              label="Roles"
              onChange={() => {}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreate} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  else return <></>;
}
