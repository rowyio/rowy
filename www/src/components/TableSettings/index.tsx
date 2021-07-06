import { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";
import _find from "lodash/find";

import {
  makeStyles,
  createStyles,
  Button,
  DialogContentText,
} from "@material-ui/core";

import Confirmation from "components/Confirmation";
import GoIcon from "assets/icons/Go";

import { FormDialog } from "@antlerengineering/form-builder";
import { tableSettings } from "./form";

import { useFiretableContext } from "contexts/FiretableContext";
import useRouter from "../../hooks/useRouter";
import { db } from "../../firebase";

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
  } | null;
}

const FORM_EMPTY_STATE = {
  name: "",
  collection: "",
  section: "",
  description: "",
  isCollectionGroup: false,
  roles: ["ADMIN"],
};

const useStyles = makeStyles((theme) =>
  createStyles({
    buttonGrid: { padding: theme.spacing(3, 0) },
    button: { width: 160 },

    formFooter: {
      marginTop: theme.spacing(4),

      "& button": {
        paddingLeft: theme.spacing(1.5),
        display: "flex",
      },
    },
    collectionName: { fontFamily: theme.typography.fontFamilyMono },
  })
);

export default function TableSettingsDialog({
  mode,
  clearDialog,
  data,
}: ICreateTableDialogProps) {
  const classes = useStyles();

  const { settingsActions, sections, roles, tables } = useFiretableContext();
  const sectionNames = sections ? Object.keys(sections) : [];

  const router = useRouter();
  const open = mode !== null;

  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open && !mounted) setMounted(true);
    if (!open && mounted)
      setTimeout(() => {
        if (mounted) setMounted(false);
      }, 300);
  }, [open]);

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

  if (!mounted) return null;

  const handleSubmit = async (values) => {
    const data: any = {
      ...values,
      isCollectionGroup: values.tableType === "collectionGroup",
    };

    if (values.schemaSource)
      data.schemaSource = _find(tables, { collection: values.schemaSource });

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

  const handleResetStructure = async () => {
    const schemaDocRef = db.doc(
      `_FIRETABLE_/settings/schema/${data!.collection}`
    );
    await schemaDocRef.update({ columns: {} });
    handleClose();
  };

  const handleDelete = async () => {
    const tablesDocRef = db.doc(`_FIRETABLE_/settings`);
    const tableData = (await tablesDocRef.get()).data();
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
      fields={tableSettings(
        mode,
        roles,
        sectionNames,
        tables?.map((table) => ({ label: table.name, value: table.collection }))
      )}
      values={{
        tableType: data?.isCollectionGroup
          ? "collectionGroup"
          : "primaryCollection",
        ...data,
      }}
      onSubmit={handleSubmit}
      SubmitButtonProps={{
        children:
          mode === TableSettingsDialogModes.create ? "Create" : "Update",
      }}
      // customActions={
      //   <Grid
      //     container
      //     spacing={2}
      //     justify="center"
      //     // className={classes.buttonGrid}
      //   >
      //     <Grid item>
      //       <Button
      //         size="large"
      //         variant="outlined"
      //         onClick={handleClose}
      //         // className={classes.button}
      //       >
      //         Cancel
      //       </Button>
      //     </Grid>
      //     <Grid item>
      //       <Button
      //         size="large"
      //         variant="contained"
      //         type="submit"
      //         // className={classes.button}
      //       >
      //         {mode === TableSettingsDialogModes.create ? "Create" : "Update"}
      //       </Button>
      //     </Grid>
      //   </Grid>
      // }
      formFooter={
        mode === TableSettingsDialogModes.update ? (
          <div className={classes.formFooter}>
            <Confirmation
              message={{
                title: `Are you sure you want to delete the table structure for “${formState.name}”?`,
                body: (
                  <>
                    <DialogContentText>
                      This will only delete the column structure for this table,
                      so you can set up the columns again.
                    </DialogContentText>
                    <DialogContentText>
                      You will not lose any data in your Firestore collection
                      named “
                      <span className={classes.collectionName}>
                        {formState.collection}
                      </span>
                      ” .
                    </DialogContentText>
                  </>
                ),
                confirm: "Reset",
              }}
              functionName="onClick"
            >
              <Button onClick={handleResetStructure} endIcon={<GoIcon />}>
                Reset Table Structure
              </Button>
            </Confirmation>

            <Confirmation
              message={{
                title: `Are you sure you want to delete the table “${formState.name}”?`,
                body: (
                  <>
                    <DialogContentText>
                      This will only delete the Firetable configuration data.
                    </DialogContentText>
                    <DialogContentText>
                      You will not lose any data in your Firestore collection
                      named “
                      <span className={classes.collectionName}>
                        {formState.collection}
                      </span>
                      ” .
                    </DialogContentText>
                  </>
                ),
                confirm: "DELETE",
              }}
              functionName="onClick"
            >
              <Button onClick={handleDelete} endIcon={<GoIcon />}>
                Delete Table
              </Button>
            </Confirmation>
          </div>
        ) : null
      }
    />
  );
}
