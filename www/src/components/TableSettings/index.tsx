import React, { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";

import useRouter from "../../hooks/useRouter";
import { db } from "../../firebase";
import DeleteIcon from "@material-ui/icons/DeleteForever";

import { Button } from "@material-ui/core";
import { useFiretableContext } from "../../contexts/firetableContext";

import Confirmation from "components/Confirmation";

import { FormDialog } from "@antlerengineering/form-builder";
import { tableSettings } from "./form";

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
    tableType: string;
    isCollectionGroup: boolean;
  } | null;
}

const FORM_EMPTY_STATE = {
  name: "",
  section: "",
  collection: "",
  description: "",
  roles: ["ADMIN"],
  isCollectionGroup: false,
};
export default function TableSettingsDialog({
  mode,
  clearDialog,
  data,
}: ICreateTableDialogProps) {
  const { settingsActions, tables } = useFiretableContext();
  const sections = tables?.reduce((accSections: string[], currTable: any) => {
    if (currTable.section && !accSections.includes(currTable.section)) {
      return [...accSections, currTable.section];
    } else return accSections;
  }, []);
  const roles = tables?.reduce((accRoles: string[], currTable: any) => {
    const newRoles = currTable.roles
      .map((role) => {
        if (!accRoles.includes(role)) return role;
      })
      .filter((role) => role);
    return [...accRoles, ...newRoles];
  }, []);
  //const
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

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);
  const [loading, setLoading] = useState(true);
  if (!open) return <></>;
  return (
    <FormDialog
      onClose={handleClose}
      open={open}
      title={
        mode === TableSettingsDialogModes.create
          ? "Create Table"
          : "Update Table"
      }
      fields={tableSettings(mode, roles, sections)}
      values={{
        tableType: data?.isCollectionGroup
          ? "collectionGroup"
          : "primaryCollection",
        ...data,
      }}
      onSubmit={async (values) => {
        const data: any = {
          ...values,
          isCollectionGroup: values.tableType === "collectionGroup",
        };
        setLoading(true);
        if (mode === TableSettingsDialogModes.update) {
          await Promise.all([
            settingsActions?.updateTable(data),
            handleClose(),
          ]);
          window.location.reload();
        } else {
          settingsActions?.createTable(data);

          if (router.location.pathname === "/") {
            router.history.push(
              `${
                values.tableType === "collectionGroup" ? "tableGroup" : "table"
              }/${values.collection}`
            );
          } else {
            router.history.push(values.collection);
          }
        }

        handleClose();
      }}
      customComponents={{}}
      formFooter={
        <>
          {" "}
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
                fullWidth
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
                      Boolean(data?.isCollectionGroup)
                        ? "schema"
                        : "groupSchema"
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
        </>
      }
    />
  );
}
