import useSWR from "swr";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";

import { Stack, Button, DialogContentText } from "@mui/material";

import { FormDialog } from "@rowy/form-builder";
import { tableSettings } from "./form";
import CamelCaseId from "./CamelCaseId";
import SuggestedRules from "./SuggestedRules";
import Confirmation from "@src/components/Confirmation";

import { useProjectContext, Table } from "@src/contexts/ProjectContext";
import useRouter from "@src/hooks/useRouter";
import { routes } from "@src/constants/routes";
import { db } from "@src/firebase";
import { name } from "@root/package.json";
import {
  SETTINGS,
  TABLE_SCHEMAS,
  TABLE_GROUP_SCHEMAS,
} from "@src/config/dbPaths";
import { runRoutes } from "@src/constants/runRoutes";
import { analytics } from "@src/analytics";

export enum TableSettingsDialogModes {
  create,
  update,
}
export interface ICreateTableDialogProps {
  mode: TableSettingsDialogModes | null;
  clearDialog: () => void;
  data: Table | null;
}

export default function TableSettingsDialog({
  mode,
  clearDialog,
  data,
}: ICreateTableDialogProps) {
  const { settingsActions, roles, tables, rowyRun } = useProjectContext();
  const sectionNames = Array.from(
    new Set((tables ?? []).map((t) => t.section))
  );

  const router = useRouter();

  const { data: collections } = useSWR(
    "firebaseCollections",
    () => rowyRun?.({ route: runRoutes.listCollections }),
    { fallbackData: [], revalidateIfStale: false, dedupingInterval: 60_000 }
  );

  const open = mode !== null;

  if (!open) return null;

  const handleSubmit = async (v) => {
    const { _suggestedRules, ...values } = v;
    const data: any = { ...values };

    if (values.schemaSource)
      data.schemaSource = _find(tables, { id: values.schemaSource });

    if (mode === TableSettingsDialogModes.update) {
      await settingsActions?.updateTable(data);
      clearDialog();
    } else {
      settingsActions?.createTable(data);

      if (router.location.pathname === "/") {
        router.history.push(
          `${values.tableType === "collectionGroup" ? "tableGroup" : "table"}/${
            values.id
          }`
        );
      } else {
        router.history.push(values.id);
      }
    }
    analytics.logEvent(
      TableSettingsDialogModes.update ? "update_table" : "create_table",
      { type: values.tableType }
    );
    clearDialog();
  };

  const handleResetStructure = async () => {
    const schemaDocRef = db.doc(`${TABLE_SCHEMAS}/${data!.id}`);
    await schemaDocRef.update({ columns: {} });
    clearDialog();
  };

  const handleDelete = async () => {
    const tablesDocRef = db.doc(SETTINGS);
    const tableData = (await tablesDocRef.get()).data();
    const updatedTables = tableData?.tables.filter(
      (table) => table.id !== data?.id || table.tableType !== data?.tableType
    );
    await tablesDocRef.update({ tables: updatedTables });
    await db
      .collection(
        data?.tableType === "primaryCollection"
          ? TABLE_SCHEMAS
          : TABLE_GROUP_SCHEMAS
      )
      .doc(data?.id)
      .delete();
    clearDialog();
    router.history.push(routes.home);
  };

  return (
    <FormDialog
      onClose={clearDialog}
      title={
        mode === TableSettingsDialogModes.create
          ? "Create table"
          : "Table settings"
      }
      fields={tableSettings(
        mode,
        roles,
        sectionNames,
        _sortBy(
          tables?.map((table) => ({
            label: table.name,
            value: table.id,
            section: table.section,
            collection: table.collection,
          })),
          ["section", "label"]
        ),
        Array.isArray(collections) ? collections : []
      )}
      customComponents={{
        camelCaseId: {
          component: CamelCaseId,
          defaultValue: "",
          validation: [["string"]],
        },
        suggestedRules: {
          component: SuggestedRules,
          defaultValue: "",
          validation: [["string"]],
        },
      }}
      values={{ ...data }}
      onSubmit={handleSubmit}
      SubmitButtonProps={{
        children:
          mode === TableSettingsDialogModes.create ? "Create" : "Update",
      }}
      formFooter={
        mode === TableSettingsDialogModes.update ? (
          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{ mt: 6 }}
          >
            <Confirmation
              message={{
                title: `Reset columns of “${data?.name}”?`,
                body: (
                  <>
                    <DialogContentText paragraph>
                      This will only reset the columns of this column so you can
                      set up the columns again.
                    </DialogContentText>
                    <DialogContentText>
                      You will not lose any data in your Firestore collection{" "}
                      <code>{data?.collection}</code>.
                    </DialogContentText>
                  </>
                ),
                confirm: "Reset",
                color: "error",
              }}
              functionName="onClick"
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleResetStructure}
                style={{ width: 150 }}
              >
                Reset columns…
              </Button>
            </Confirmation>

            <Confirmation
              message={{
                title: `Delete the table “${data?.name}”?`,
                body: (
                  <>
                    <DialogContentText paragraph>
                      This will only delete the {name} configuration data.
                    </DialogContentText>
                    <DialogContentText>
                      You will not lose any data in your Firestore collection{" "}
                      <code>{data?.collection}</code>.
                    </DialogContentText>
                  </>
                ),
                confirm: "Delete",
                color: "error",
              }}
              functionName="onClick"
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                style={{ width: 150 }}
              >
                Delete table…
              </Button>
            </Confirmation>
          </Stack>
        ) : null
      }
    />
  );
}
