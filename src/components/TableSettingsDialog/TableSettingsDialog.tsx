import { useAtom, useSetAtom } from "jotai";
import useSWR from "swr";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";
import { find, sortBy, get, isEmpty } from "lodash-es";
import { FieldValues } from "react-hook-form";

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
  globalScope,
  tableSettingsDialogAtom,
  tablesAtom,
  rolesAtom,
  rowyRunAtom,
  confirmDialogAtom,
} from "@src/atoms/globalScope";
import { TableSettings } from "@src/types/table";
import { analytics, logEvent } from "@src/analytics";

// TODO:
// import { useSnackLogContext } from "@src/contexts/SnackLogContext";
import { runRoutes } from "@src/constants/runRoutes";
import {
  CONFIG,
  TABLE_GROUP_SCHEMAS,
  TABLE_SCHEMAS,
} from "@src/config/dbPaths";
import { Controller } from "react-hook-form";
import { ROUTES } from "@src/constants/routes";

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

export default function TableSettingsDialog() {
  const [{ open, mode, data }, setTableSettingsDialog] = useAtom(
    tableSettingsDialogAtom,
    globalScope
  );
  const clearDialog = () => setTableSettingsDialog({ open: false });

  const [roles] = useAtom(rolesAtom, globalScope);
  const [tables] = useAtom(tablesAtom, globalScope);
  const [rowyRun] = useAtom(rowyRunAtom, globalScope);

  const location = useLocation();
  const navigate = useNavigate();
  const confirm = useSetAtom(confirmDialogAtom, globalScope);
  // const snackLogContext = useSnackLogContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const sectionNames = Array.from(
    new Set((tables ?? []).map((t) => t.section))
  );

  const { data: collections } = useSWR(
    "firebaseCollections",
    () => rowyRun({ route: runRoutes.listCollections }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60_000 * 60,
    }
  );

  if (!open) return null;

  // TODO: types
  const handleSubmit = async (v: FieldValues) => {
    const { _suggestedRules, ...values } = v;
    const data = { ...values };

    if (values.schemaSource)
      data.schemaSource = find(tables, { id: values.schemaSource });

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
            const tableConfigPath = `${
              data.tableType !== "collectionGroup"
                ? TABLE_SCHEMAS
                : TABLE_GROUP_SCHEMAS
            }/${data.id}`;

            if (hasExtensions) {
              // find derivative, default value
              // TODO:
              // snackLogContext.requestSnackLog();
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
              _schema.extensionObjects = get(
                data,
                "_schema.extensionObjects"
                // TODO: types
              )!.map((x: any) => ({
                ...x,
                active: false,
              }));
            }
            if (hasWebhooks) {
              // TODO: types
              _schema.webhooks = get(data, "_schema.webhooks")!.map(
                (x: any) => ({
                  ...x,
                  active: false,
                })
              );
            }

            // TODO:
            // await settingsActions?.updateTable({
            //   id: data.id,
            //   tableType: data.tableType,
            //   _schema,
            // });
            if (onComplete) onComplete();
          },
        });
      } else {
        if (onComplete) onComplete();
      }
    };

    if (mode === "update") {
      // TODO:
      // await settingsActions?.updateTable(data);
      deployExtensionsWebhooks();
      clearDialog();
      logEvent(analytics, "update_table", { type: values.tableType });
      enqueueSnackbar("Updated table");
    } else {
      const creatingSnackbar = enqueueSnackbar("Creating table…", {
        persist: true,
      });
      // TODO:
      // await settingsActions?.createTable(data);
      await logEvent(analytics, "create_table", { type: values.tableType });
      deployExtensionsWebhooks(() => {
        if (location.pathname === ROUTES.tables) {
          navigate(
            `${
              values.tableType === "collectionGroup"
                ? ROUTES.tableGroup
                : ROUTES.table
            }/${values.id}`
          );
        } else {
          navigate(values.id);
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
    sortBy(
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
        (mode === "create" ? "Create table" : "Table settings") +
        " (INCOMPLETE)"
      }
      fields={fields}
      customBody={(formFieldsProps) => {
        const { errors } = formFieldsProps.useFormMethods.formState;
        const groupedErrors: Record<string, string> = Object.entries(
          errors
        ).reduce((acc, [name, err]) => {
          const match = find(fields, ["name", name])?.step;
          if (!match) return acc;
          acc[match] = err.message;
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
      onSubmit={handleSubmit}
      SubmitButtonProps={{
        children: mode === "create" ? "Create" : "Update",
        // TODO:
        disabled: true,
      }}
    />
  );
}
