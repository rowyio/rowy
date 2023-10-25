import { useAtom, useSetAtom } from "jotai";
import useSWR from "swr";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { find, sortBy, get, isEmpty } from "lodash-es";
import { Controller } from "react-hook-form";

import { DialogContentText, Stack, Typography } from "@mui/material";

import { FormDialog, FormFields } from "@rowy/form-builder";
import { tableSettings } from "./form";
import TableName from "./TableName";
import TableId from "./TableId";
import SuggestedRules from "./SuggestedRules";
import SteppedAccordion from "@src/components/SteppedAccordion";
import ActionsMenu from "./ActionsMenu";
import DeleteMenu from "./DeleteMenu";

import {
  projectScope,
  tableSettingsDialogAtom,
  tablesAtom,
  projectRolesAtom,
  rowyRunAtom,
  confirmDialogAtom,
  createTableAtom,
  updateTableAtom,
  AdditionalTableSettings,
} from "@src/atoms/projectScope";
import { TableSettings } from "@src/types/table";
import { analytics, logEvent } from "@src/analytics";

import { runRoutes } from "@src/constants/runRoutes";
import { CONFIG } from "@src/config/dbPaths";
import { ROUTES } from "@src/constants/routes";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";
import {
  getTableSchemaPath,
  getTableBuildFunctionPathname,
} from "@src/utils/table";
import { firebaseStorageAtom } from "@src/sources/ProjectSourceFirebase";
import { uploadTableThumbnail } from "./utils";
import TableThumbnail from "./TableThumbnail";
import TableDetails from "./TableDetails";

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
  tableThumbnail: {
    component: TableThumbnail,
  },
  tableDetails: {
    component: TableDetails,
  },
};

export default function TableSettingsDialog() {
  const [{ open, mode, data }, setTableSettingsDialog] = useAtom(
    tableSettingsDialogAtom,
    projectScope
  );
  const clearDialog = () => setTableSettingsDialog({ open: false });

  const [projectRoles] = useAtom(projectRolesAtom, projectScope);
  const [tables] = useAtom(tablesAtom, projectScope);
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [firebaseStorage] = useAtom(firebaseStorageAtom, projectScope);

  const navigate = useNavigate();
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const snackLogContext = useSnackLogContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const sectionNames = Array.from(
    new Set((tables ?? []).map((t) => t.section))
  );

  const { data: collections } = useSWR(
    "collectionsList",
    async () => {
      const result = await rowyRun({ route: runRoutes.listCollections });
      return result || [];
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60_000 * 60,
    }
  );

  const [createTable] = useAtom(createTableAtom, projectScope);
  const [updateTable] = useAtom(updateTableAtom, projectScope);

  if (!open) return null;

  const handleSubmit = async (
    v: TableSettings & AdditionalTableSettings & { thumbnailFile: File }
  ) => {
    const {
      _schemaSource,
      _initialColumns,
      _schema,
      _suggestedRules,
      thumbnailFile,
      ...values
    } = v;

    let thumbnailURL = values.thumbnailURL;
    if (thumbnailFile) {
      thumbnailURL = await uploadTableThumbnail(firebaseStorage)(
        values.id,
        thumbnailFile
      );
    }
    const data = { ...values, thumbnailURL };

    const hasExtensions = !isEmpty(get(data, "_schema.extensionObjects"));
    const hasWebhooks = !isEmpty(get(data, "_schema.webhooks"));
    const deployExtensionsWebhooks = (onComplete?: () => void) => {
      if (rowyRun && (hasExtensions || hasWebhooks)) {
        confirm({
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
            const tableConfigPath = getTableSchemaPath(data);

            if (hasExtensions) {
              // find derivative, default value
              snackLogContext.requestSnackLog();
              rowyRun({
                route: runRoutes.buildFunction,
                body: {
                  tablePath,
                  // pathname must match old URL format
                  pathname: getTableBuildFunctionPathname(
                    data.id,
                    data.tableType
                  ),
                  tableConfigPath,
                },
              });
              logEvent(analytics, "deployed_extensions");
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
              logEvent(analytics, "published_webhooks");
            }

            if (onComplete) onComplete();
          },
          handleCancel: async () => {
            let _schema: Record<string, any> = {};
            if (hasExtensions) {
              _schema.extensionObjects = (
                get(
                  data,
                  "_schema.extensionObjects"
                  // TODO: types
                ) ?? []
              ).map((x: any) => ({
                ...x,
                active: false,
              }));
            }
            if (hasWebhooks) {
              // TODO: types
              _schema.webhooks = (get(data, "_schema.webhooks") ?? []).map(
                (x: any) => ({
                  ...x,
                  active: false,
                })
              );
            }

            await updateTable!(
              { id: data.id, tableType: data.tableType },
              { _schema }
            );
            if (onComplete) onComplete();
          },
        });
      } else {
        if (onComplete) onComplete();
      }
    };

    if (mode === "update") {
      await updateTable!(data, { _schema });
      deployExtensionsWebhooks();
      clearDialog();
      logEvent(analytics, "update_table", { type: values.tableType });
      enqueueSnackbar("Updated table");
    } else {
      const creatingSnackbar = enqueueSnackbar("Creating table…", {
        persist: true,
      });

      await createTable!(data, {
        _schemaSource,
        _initialColumns,
        _schema,
        _suggestedRules,
      });
      logEvent(analytics, "create_table", { type: values.tableType });
      deployExtensionsWebhooks(() => {
        navigate(`${ROUTES.table}/${values.id}`);
        clearDialog();
        closeSnackbar(creatingSnackbar);
      });
    }
  };

  const fields = tableSettings(
    mode,
    projectRoles,
    sectionNames,
    sortBy(
      tables?.map((table) => ({
        label: table.name,
        value: table.id,
        section: table.section,
        collection: table.collection,
      })),
      ["section", "label"]
    ),
    Array.isArray(collections) &&
      collections.filter((x) => x !== CONFIG).length > 0
      ? collections.filter((x) => x !== CONFIG)
      : null
  );

  return (
    <FormDialog
      onClose={clearDialog}
      title={mode === "create" ? "Create table" : "Table settings"}
      fields={fields}
      customBody={(formFieldsProps) => {
        const { errors } = formFieldsProps.useFormMethods.formState;
        const groupedErrors: Record<string, string> = Object.entries(
          errors
        ).reduce((acc, [name, err]) => {
          const match = find(fields, ["name", name])?.step;
          if (!match) return acc;
          acc[match] = (err?.message as string) ?? "";
          return acc;
        }, {} as Record<string, string>);

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
              {mode === "update" && (
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
                  /*
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
                  mode === "create"
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
      onSubmit={handleSubmit as any}
      SubmitButtonProps={{
        children: mode === "create" ? "Create" : "Update",
        disabled:
          (mode === "create" && !createTable) ||
          (mode === "update" && !updateTable),
      }}
    />
  );
}
