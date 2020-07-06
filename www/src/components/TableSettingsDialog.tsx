import React, { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";

import useRouter from "../hooks/useRouter";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Select,
  Typography,
} from "@material-ui/core";
import { useFiretableContext } from "../contexts/firetableContext";
import OptionsInput from "./Table/ColumnMenu/ConfigFields/OptionsInput";
export enum TableSettingsDialogModes {
  create,
  update,
}
export interface ICreateTableDialogProps {
  /** dialog Modes create or udpate table */

  mode: TableSettingsDialogModes | null;
  clearDialog: () => void;
  data: {
    collection: string;
    roles: string[];
    section: string;
    description: string;
    name: string;
  } | null;
}

const FORM_EMPTY_STATE = {
  name: "",
  section: "",
  collection: "",
  description: "",
  roles: ["ADMIN"],
};
export default function TableSettingsDialog({
  mode,
  clearDialog,
  data,
}: ICreateTableDialogProps) {
  const { settingsActions } = useFiretableContext();
  const router = useRouter();
  const open = mode !== null;

  const [formState, setForm] = useState(FORM_EMPTY_STATE);
  const handleChange = (key: string, value: any) =>
    setForm({ ...formState, [key]: value });
  useEffect(() => {
    if (mode === TableSettingsDialogModes.create)
      handleChange("collection", _camelCase(formState.name));
  }, [formState.name]);

  function handleClose() {
    setForm(FORM_EMPTY_STATE);
    clearDialog();
  }
  function handleCreate() {
    settingsActions?.createTable(formState);

    if (router.location.pathname === "/") {
      router.history.push(`table/${formState.collection}`);
    } else {
      router.history.push(formState.collection);
    }
    handleClose();
  }
  async function handleUpdate() {
    await Promise.all([settingsActions?.updateTable(formState), handleClose()]);
    window.location.reload();
  }
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {mode === TableSettingsDialogModes.create
            ? "New table"
            : "Update Table"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mode === TableSettingsDialogModes.create
              ? "Create a new Table"
              : `Updating table with collection key:${formState.collection}`}
          </DialogContentText>

          <TextField
            autoFocus
            onChange={e => handleChange("name", e.target.value)}
            value={formState.name}
            margin="dense"
            id="name"
            label="Table Name"
            type="text"
            fullWidth
            variant="filled"
          />
          {mode === TableSettingsDialogModes.create && (
            <TextField
              value={formState.collection}
              onChange={e => handleChange("collection", e.target.value)}
              variant="filled"
              margin="dense"
              id="collection"
              label="Collection Name"
              type="text"
              fullWidth
            />
          )}

          <TextField
            value={formState.section}
            onChange={e => handleChange("section", e.target.value)}
            variant="filled"
            margin="dense"
            id="section"
            label="Section Name"
            type="text"
            fullWidth
          />

          <TextField
            label="Description"
            id="description"
            variant="filled"
            fullWidth
            multiline={true}
            value={formState.description}
            onChange={e => handleChange("description", e.target.value)}
          />
          <OptionsInput
            placeholder={"Add Role"}
            options={formState.roles ?? []}
            handleChange={update => handleChange("roles", update)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {mode === TableSettingsDialogModes.create && (
            <Button onClick={handleCreate} color="primary">
              Create
            </Button>
          )}
          {mode === TableSettingsDialogModes.update && (
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
