import React, { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";

import useRouter from "../../hooks/useRouter";
import { db } from "../../firebase";
import DeleteIcon from "@material-ui/icons/DeleteForever";

import { makeStyles, createStyles, Grid, Button } from "@material-ui/core";
import { useFiretableContext } from "../../contexts/firetableContext";

import Confirmation from "components/Confirmation";

import { FormDialog } from "@antlerengineering/form-builder";
import { tableSettings } from "./form";

export enum TableSettingsDialogModes {
  create,
  update,
}
export interface ICreateTableDialogProps {
  mode: TableSettingsDialogModes | null;
  clearDialog: () => void;
  data: {
    name: string;
    collection: string;
    tableType: string;
    section: string;
    description: string;
    isCollectionGroup: boolean;
    roles: string[];
    copySchema: string;
  } | null;
}

const FORM_EMPTY_STATE = {
  name: "",
  collection: "",
  section: "",
  description: "",
  isCollectionGroup: false,
  roles: ["ADMIN"],
  copySchema: "",
};

const useStyles = makeStyles((theme) =>
  createStyles({
    buttonGrid: { padding: theme.spacing(3, 0) },
    button: { width: 160 },

    deleteButton: {
      display: "flex",
      margin: "0 auto",
      marginTop: theme.spacing(4),
    },
  })
);

export default function TableSettingsDialog({
  mode,
  clearDialog,
  data,
}: ICreateTableDialogProps) {
  const classes = useStyles();

  const { settingsActions, sections, roles } = useFiretableContext();

  const sectionNames = sections ? Object.keys(sections) : [];

  const router = useRouter();
  const open = mode !== null;

  const [formState, setForm] = useState(FORM_EMPTY_STATE);

  const handleChange = (key: string, value: any) =>
    setForm({ ...formState, [key]: value });

  useEffect(() => {
    if (mode === TableSettingsDialogModes.create)
      handleChange("collection", _camelCase(formState.name));
  }, [formState.name]);

  const handleClose = () => {
    setForm(FORM_EMPTY_STATE);
    clearDialog();
  };

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const [loading, setLoading] = useState(true);

  if (!open) return null;

  const handleSubmit = async (values) => {
    const data: any = {
      ...values,
      isCollectionGroup: values.tableType === "collectionGroup",
    };

    setLoading(true);

    if (mode === TableSettingsDialogModes.update) {
      await Promise.all([settingsActions?.updateTable(data), handleClose()]);
      window.location.reload();
    } else {
      settingsActions?.createTable(data);

      if (router.location.pathname === "/") {
        router.history.push(
          `${values.tableType === "collectionGroup" ? "tableGroup" : "table"}/${
            values.collection
          }`
        );
      } else {
        router.history.push(values.collection);
      }
    }

    handleClose();
  };

  const handleDelete = async () => {
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
      .collection(Boolean(data?.isCollectionGroup) ? "schema" : "groupSchema")
      .doc(data?.collection)
      .delete();
    window.location.reload();
    handleClose();
    setLoading(false);
  };

  return (
    <FormDialog
      onClose={handleClose}
      open={open}
      title={
        mode === TableSettingsDialogModes.create
          ? "Create Table"
          : "Update Table"
      }
      fields={tableSettings(mode, roles, sectionNames)}
      values={{
        tableType: data?.isCollectionGroup
          ? "collectionGroup"
          : "primaryCollection",
        ...data,
      }}
      onSubmit={handleSubmit}
      customActions={
        <Grid
          container
          spacing={2}
          justify="center"
          className={classes.buttonGrid}
        >
          <Grid item>
            <Button
              size="large"
              variant="outlined"
              onClick={handleClose}
              className={classes.button}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              size="large"
              variant="contained"
              type="submit"
              className={classes.button}
            >
              {mode === TableSettingsDialogModes.create ? "Create" : "Update"}
            </Button>
          </Grid>
        </Grid>
      }
      formFooter={
        mode === TableSettingsDialogModes.update ? (
          <Confirmation
            message={{
              title: `Are you sure you want to delete ${formState.name}'s table`,
              body: `This will only delete the firetable configuration data and not the data stored in in the firestore collection ${formState.collection}`,
              confirm: "DELETE",
            }}
            functionName="onClick"
          >
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              onClick={handleDelete}
              startIcon={<DeleteIcon />}
              className={classes.deleteButton}
            >
              Delete Table
            </Button>
          </Confirmation>
        ) : null
      }
    />
  );
}
