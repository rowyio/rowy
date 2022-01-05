import useSWR from "swr";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";

import { DialogContentText, Stack } from "@mui/material";

import { FormDialog, FormFields } from "@rowy/form-builder";
import { tableSettings } from "./form";
import CamelCaseId from "./CamelCaseId";
import SuggestedRules from "./SuggestedRules";
import SteppedAccordion from "@src/components/SteppedAccordion";
import Confirmation from "@src/components/Confirmation";
import DeleteMenu from "./DeleteMenu";

import { useProjectContext, Table } from "@src/contexts/ProjectContext";
import useRouter from "@src/hooks/useRouter";
import { runRoutes } from "@src/constants/runRoutes";
import { analytics } from "@src/analytics";
import { CONFIG } from "config/dbPaths";

export enum TableSettingsDialogModes {
  create,
  update,
}
export interface ICreateTableDialogProps {
  mode: TableSettingsDialogModes | null;
  clearDialog: () => void;
  data: Table | null;
}

export default function TableSettings({
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

  const fields = tableSettings(
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
    Array.isArray(collections) ? collections.filter((x) => x !== CONFIG) : []
  );
  const customComponents = {
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
  };

  return (
    <FormDialog
      onClose={clearDialog}
      title={
        mode === TableSettingsDialogModes.create
          ? "Create table"
          : "Table settings"
      }
      fields={fields}
      customBody={(formFieldsProps) => (
        <>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: "flex",
              height: "var(--dialog-title-height)",
              alignItems: "center",

              position: "absolute",
              top: 0,
              right: 40 + 12 + 8,
            }}
          >
            {mode === TableSettingsDialogModes.update && (
              <DeleteMenu clearDialog={clearDialog} data={data} />
            )}
          </Stack>

          <SteppedAccordion
            disableUnmount
            steps={
              [
                {
                  id: "collection",
                  title: "Collection",
                  content: (
                    <>
                      <DialogContentText paragraph>
                        Connect this table to a new or existing Firestore
                        collection
                      </DialogContentText>
                      <FormFields
                        {...formFieldsProps}
                        fields={fields.filter((f) => f.step === "collection")}
                      />
                    </>
                  ),
                  optional: false,
                },
                {
                  id: "display",
                  title: "Display",
                  content: (
                    <>
                      <DialogContentText paragraph>
                        Set how this table is displayed to users
                      </DialogContentText>
                      <FormFields
                        {...formFieldsProps}
                        fields={fields.filter((f) => f.step === "display")}
                        customComponents={customComponents}
                      />
                    </>
                  ),
                  optional: false,
                },
                {
                  id: "accessControls",
                  title: "Access controls",
                  content: (
                    <>
                      <DialogContentText paragraph>
                        Set who can view and edit this table. Only ADMIN users
                        can edit table settings or add, edit, and delete
                        columns.
                      </DialogContentText>
                      <FormFields
                        {...formFieldsProps}
                        fields={fields.filter(
                          (f) => f.step === "accessControls"
                        )}
                        customComponents={customComponents}
                      />
                    </>
                  ),
                  optional: false,
                },
                {
                  id: "auditing",
                  title: "Auditing",
                  content: (
                    <>
                      <DialogContentText paragraph>
                        Track when users create or update rows
                      </DialogContentText>
                      <FormFields
                        {...formFieldsProps}
                        fields={fields.filter((f) => f.step === "auditing")}
                      />
                    </>
                  ),
                  optional: true,
                },
                mode === TableSettingsDialogModes.create
                  ? {
                      id: "columns",
                      title: "Columns",
                      content: (
                        <>
                          <DialogContentText paragraph>
                            Initialize table with columns
                          </DialogContentText>
                          <FormFields
                            {...formFieldsProps}
                            fields={fields.filter((f) => f.step === "columns")}
                          />
                        </>
                      ),
                      optional: true,
                    }
                  : null,
              ].filter(Boolean) as any
            }
          />
        </>
      )}
      customComponents={customComponents}
      values={{ ...data }}
      onSubmit={handleSubmit}
      SubmitButtonProps={{
        children:
          mode === TableSettingsDialogModes.create ? "Create" : "Update",
      }}
    />
  );
}
