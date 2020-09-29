import React, { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";

import useRouter from "../hooks/useRouter";
import { db } from "../firebase";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { useFiretableContext } from "../contexts/firetableContext";

import RolesSelector from "./RolesSelector";
import Confirmation from "components/Confirmation";
import TableSelector from "./TableSelector";

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
    isCollectionGroup: boolean;
    copySchema: string;
  } | null;
}

const FORM_EMPTY_STATE = {
  name: "",
  section: "",
  collection: "",
  description: "",
  roles: ["ADMIN"],
  isCollectionGroup: false,
  copySchema: "",
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
      router.history.push(
        `${formState.isCollectionGroup ? "tableGroup" : "table"}/${
          formState.collection
        }`
      );
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
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {loading && <LinearProgress />}
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
            onChange={(e) => handleChange("name", e.target.value)}
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
              onChange={(e) => handleChange("collection", e.target.value)}
              variant="filled"
              margin="dense"
              id="collection"
              label="Collection Name"
              type="text"
              fullWidth
            />
          )}

          <FormControlLabel
            control={<Switch />}
            label={"isCollectionGroup"}
            labelPlacement="start"
            checked={formState.isCollectionGroup}
            onChange={(e) =>
              handleChange("isCollectionGroup", !formState.isCollectionGroup)
            }
            // classes={{ root: classes.formControlLabel, label: classes.label }}
          />
          <TextField
            value={formState.section}
            onChange={(e) => handleChange("section", e.target.value)}
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
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <RolesSelector
            label="Roles"
            value={formState.roles ?? []}
            handleChange={(update) => handleChange("roles", update)}
          />
          {mode === TableSettingsDialogModes.create && (
            <TableSelector
              handleChange={(table) => {
                handleChange("copySchema", table.collection);
              }}
              value={formState.copySchema}
              label="Copy Schema"
            />
          )}
        </DialogContent>

        {mode === TableSettingsDialogModes.update && (
          <Confirmation
            message={{
              title: `Are you sure you want to delete ${formState.name}'s table`,
              body: `This will only delete the firetable configuration data and not the data stored in in the firestore collection ${formState.collection}`,
              confirm: "delete",
            }}
            functionName="onClick"
          >
            <Button
              onClick={async () => {
                setLoading(true);

                const tablesDocRef = db.doc(`_FIRETABLE_/settings`);
                const tablesDoc = await tablesDocRef.get();
                const tableData = tablesDoc.data();
                const updatedTables = tableData?.tables.filter(
                  (table) =>
                    table.collection !== data?.collection ||
                    table.isCollectionGroup !== data?.isCollectionGroup
                );
                await tablesDocRef.update({ tables: updatedTables });
                await tablesDocRef
                  .collection(
                    Boolean(data?.isCollectionGroup) ? "schema" : "groupSchema"
                  )
                  .doc(data?.collection)
                  .delete();
                window.location.reload();
                handleClose();
                setLoading(false);
              }}
            >
              <DeleteIcon />
              Delete Table
            </Button>
          </Confirmation>
        )}

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
