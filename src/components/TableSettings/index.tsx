import useSWR from "swr";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { useSnackbar } from "notistack";

import { DialogContentText, Stack, Typography } from "@mui/material";

import { FormDialog, FormFields } from "@rowy/form-builder";
import { tableSettings } from "./form";
import TableName from "./TableName";
import TableId from "./TableId";
import SuggestedRules from "./SuggestedRules";
import SteppedAccordion from "@src/components/SteppedAccordion";
import ActionsMenu from "./ActionsMenu";
import DeleteMenu from "./DeleteMenu";

import { useProjectContext, Table } from "@src/contexts/ProjectContext";
import useRouter from "@src/hooks/useRouter";
import { useConfirmation } from "@src/components/ConfirmationDialog";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";
import { runRoutes } from "@src/constants/runRoutes";
import { analytics } from "@src/analytics";
import {
  CONFIG,
  TABLE_GROUP_SCHEMAS,
  TABLE_SCHEMAS,
} from "@src/config/dbPaths";
import { Controller } from "react-hook-form";

export enum TableSettingsDialogModes {
  create,
  update,
}
const customComponents = {
  tableName: {
    component: TableName,
    defaultValue: "",
    validation: [["string"]],
  },
  tableId: {
    component: TableId,
    defaultValue: "",
    validation: [["string"]],
  },
  suggestedRules: {
    component: SuggestedRules,
    defaultValue: "",
    validation: [["string"]],
  },
};

export interface ITableSettingsProps {
  mode: TableSettingsDialogModes | null;
  clearDialog: () => void;
  data: Table | null;
}

export default function TableSettings({
  mode,
  clearDialog,
  data,
}: ITableSettingsProps) {
  const { settingsActions, roles, tables, rowyRun } = useProjectContext();
  const sectionNames = Array.from(
    new Set((tables ?? []).map((t) => t.section))
  );

  const router = useRouter();
  const { requestConfirmation } = useConfirmation();
  const snackLogContext = useSnackLogContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { data: collections } = useSWR(
    "firebaseCollections",
    () => rowyRun?.({ route: runRoutes.listCollections }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60_000 * 60,
    }
  );

  const open = mode !== null;

  if (!open) return null;

  const handleSubmit = async (v) => {
    const { _suggestedRules, ...values } = v;
    const data = { ...values };

    if (values.schemaSource)
      data.schemaSource = _find(tables, { id: values.schemaSource });

    const hasExtensions = !_isEmpty(_get(data, "_schema.extensionObjects"));
    const hasWebhooks = !_isEmpty(_get(data, "_schema.webhooks"));
    const deployExtensionsWebhooks = (onComplete?: () => void) => {
      if (rowyRun && (hasExtensions || hasWebhooks)) {
        requestConfirmation({
          title: `Deploy ${[
            hasExtensions && "extensions",
            hasWebhooks && "webhooks",
          ]
            .filter(Boolean)
            .join(" and ")}?`,
          body: "You can also deploy later from the table page",
          confirm: "Deploy",
          cancel: "Later",
          handleConfirm: async () => {
            const tablePath = data.collection;
            const tableConfigPath = `${
              data.tableType !== "collectionGroup"
                ? TABLE_SCHEMAS
                : TABLE_GROUP_SCHEMAS
            }/${data.id}`;

            if (hasExtensions) {
              // find derivative, default value
              snackLogContext.requestSnackLog();
              rowyRun({
                route: runRoutes.buildFunction,
                body: {
                  tablePath,
                  pathname: `/${
                    data.tableType === "collectionGroup"
                      ? "tableGroup"
                      : "table"
                  }/${data.id}`,
                  tableConfigPath,
                },
              });
              analytics.logEvent("deployed_extensions");
            }

            if (hasWebhooks) {
              const resp = await rowyRun({
                service: "hooks",
                route: runRoutes.publishWebhooks,
                body: {
                  tableConfigPath,
                  tablePath,
                },
              });
              enqueueSnackbar(resp.message, {
                variant: resp.success ? "success" : "error",
              });
              analytics.logEvent("published_webhooks");
            }

            if (onComplete) onComplete();
          },
          handleCancel: async () => {
            let _schema: Record<string, any> = {};
            if (hasExtensions) {
              _schema.extensionObjects = _get(
                data,
                "_schema.extensionObjects"
              )!.map((x) => ({
                ...x,
                active: false,
              }));
            }
            if (hasWebhooks) {
              _schema.webhooks = _get(data, "_schema.webhooks")!.map((x) => ({
                ...x,
                active: false,
              }));
            }

            await settingsActions?.updateTable({
              id: data.id,
              tableType: data.tableType,
              _schema,
            });
            if (onComplete) onComplete();
          },
        });
      } else {
        if (onComplete) onComplete();
      }
    };

    if (mode === TableSettingsDialogModes.update) {
      await settingsActions?.updateTable(data);
      deployExtensionsWebhooks();
      clearDialog();
      analytics.logEvent("update_table", { type: values.tableType });
      enqueueSnackbar("Updated table");
    } else {
      const creatingSnackbar = enqueueSnackbar("Creating table…", {
        persist: true,
      });
      await settingsActions?.createTable(data);
      await analytics.logEvent("create_table", { type: values.tableType });
      deployExtensionsWebhooks(() => {
        if (router.location.pathname === "/") {
          router.history.push(
            `${
              values.tableType === "collectionGroup" ? "tableGroup" : "table"
            }/${values.id}`
          );
        } else {
          router.history.push(values.id);
        }
        clearDialog();
        closeSnackbar(creatingSnackbar);
      });
    }
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
    Array.isArray(collections) ? collections.filter((x) => x !== CONFIG) : null
  );

  return (
    <FormDialog
      onClose={clearDialog}
      title={
        mode === TableSettingsDialogModes.create
          ? "Create table"
          : "Table settings"
      }
      fields={fields}
      customBody={(formFieldsProps) => {
        const { errors } = formFieldsProps.useFormMethods.formState;
        const groupedErrors: Record<string, string> = Object.entries(
          errors
        ).reduce((acc, [name, err]) => {
          const match = _find(fields, ["name", name])?.step;
          if (!match) return acc;
          acc[match] = err.message;
          return acc;
        }, {});

        return (
          <>
            <Controller
              control={formFieldsProps.control}
              name="_schema"
              defaultValue={{}}
              render={() => <></>}
            />

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
              <ActionsMenu
                mode={mode}
                control={formFieldsProps.control}
                useFormMethods={formFieldsProps.useFormMethods}
              />
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
                    error: Boolean(groupedErrors.collection),
                    subtitle: groupedErrors.collection && (
                      <Typography variant="caption" color="error">
                        {groupedErrors.collection}
                      </Typography>
                    ),
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
                    error: Boolean(groupedErrors.display),
                    subtitle: groupedErrors.display && (
                      <Typography variant="caption" color="error">
                        {groupedErrors.display}
                      </Typography>
                    ),
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
                    error: Boolean(groupedErrors.accessControls),
                    subtitle: groupedErrors.accessControls && (
                      <Typography variant="caption" color="error">
                        {groupedErrors.accessControls}
                      </Typography>
                    ),
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
                    error: Boolean(groupedErrors.auditing),
                    subtitle: groupedErrors.auditing && (
                      <Typography variant="caption" color="error">
                        {groupedErrors.auditing}
                      </Typography>
                    ),
                  },
                  /**
                   * TODO: Figure out where to store this settings
                  
                  {
                    id: "function",
                    title: "Cloud Function",
                    content: (
                      <>
                        <DialogContentText paragraph>
                          Configure cloud function settings, this setting is shared across all tables connected to the same collection
                        </DialogContentText>
                        <FormFields
                          {...formFieldsProps}
                          fields={fields.filter((f) => f.step === "function")}
                        />
                      </>
                    ),
                    optional: true,
                    error: Boolean(groupedErrors.function),
                    subtitle: groupedErrors.auditing && (
                      <Typography variant="caption" color="error">
                        {groupedErrors.function}
                      </Typography>
                    ),
                  },
                   */
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
                              fields={fields.filter(
                                (f) => f.step === "columns"
                              )}
                            />
                          </>
                        ),
                        optional: true,
                        error: Boolean(groupedErrors.columns),
                        subtitle: groupedErrors.columns && (
                          <Typography variant="caption" color="error">
                            {groupedErrors.columns}
                          </Typography>
                        ),
                      }
                    : null,
                ].filter(Boolean) as any
              }
            />
          </>
        );
      }}
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
