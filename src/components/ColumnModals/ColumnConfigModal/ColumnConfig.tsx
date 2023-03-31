import { useState, Suspense, useMemo, createElement } from "react";
import { useAtom, useSetAtom } from "jotai";
import { set } from "lodash-es";
import { ErrorBoundary } from "react-error-boundary";
import { IColumnModalProps } from "@src/components/ColumnModals";

import { Typography, Stack } from "@mui/material";

import Modal from "@src/components/Modal";
import { getFieldProp } from "@src/components/fields";
import DefaultValueInput from "./DefaultValueInput";
import { InlineErrorFallback } from "@src/components/ErrorFallback";
import Loading from "@src/components/Loading";

import {
  projectScope,
  rowyRunAtom,
  confirmDialogAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  updateColumnAtom,
} from "@src/atoms/tableScope";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";
import { FieldType } from "@src/constants/fields";
import { runRoutes } from "@src/constants/runRoutes";
import { useSnackbar } from "notistack";
import {
  getTableSchemaPath,
  getTableBuildFunctionPathname,
} from "@src/utils/table";

export default function ColumnConfigModal({
  onClose,
  column,
}: IColumnModalProps) {
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const snackLogContext = useSnackLogContext();

  const [showRebuildPrompt, setShowRebuildPrompt] = useState(false);
  const [newConfig, setNewConfig] = useState(column.config ?? {});
  const customFieldSettings = getFieldProp("settings", column.type);
  const settingsValidator = getFieldProp("settingsValidator", column.type);
  const initializable = getFieldProp("initializable", column.type);

  const rendedFieldSettings = useMemo(
    () =>
      [FieldType.derivative, FieldType.aggregate, FieldType.formula].includes(
        column.type
      ) && newConfig.renderFieldType
        ? getFieldProp("settings", newConfig.renderFieldType)
        : null,
    [newConfig.renderFieldType, column.type]
  );

  const [errors, setErrors] = useState({});

  const validateSettings = () => {
    if (settingsValidator) {
      const errors = settingsValidator(newConfig);
      setErrors(errors);
      return errors;
    }
    setErrors({});
    return {};
  };

  const handleChange = (key: string) => (update: any) => {
    if (
      showRebuildPrompt === false &&
      (key.includes("defaultValue") || column.type === FieldType.derivative) &&
      column.config?.[key] !== update
    ) {
      setShowRebuildPrompt(true);
    }
    const updatedConfig = set(newConfig, key, update); // Modified by @devsgnr, spread operator `{...newConfig}` instead of just `newConfig` was preventing multiple calls from running properly
    setNewConfig(updatedConfig);
    validateSettings();
  };

  return (
    <Modal
      maxWidth="md"
      onClose={onClose}
      title={`${column.name}: Config`}
      disableBackdropClick
      disableEscapeKeyDown
      children={
        <Suspense fallback={<Loading fullScreen={false} />}>
          <>
            {initializable && (
              <>
                <section style={{ marginTop: 1 }}>
                  {/* top margin fixes visual bug */}
                  <ErrorBoundary FallbackComponent={InlineErrorFallback}>
                    <DefaultValueInput
                      handleChange={handleChange}
                      column={{ ...column, config: newConfig }}
                    />
                  </ErrorBoundary>
                </section>
              </>
            )}

            {customFieldSettings && (
              <Stack
                spacing={3}
                sx={{ borderTop: 1, borderColor: "divider", pt: 3 }}
              >
                {createElement(customFieldSettings, {
                  config: newConfig,
                  onChange: handleChange,
                  fieldName: column.fieldName,
                  onBlur: validateSettings,
                  errors,
                })}
              </Stack>
            )}

            {rendedFieldSettings && (
              <Stack
                spacing={3}
                sx={{ borderTop: 1, borderColor: "divider", pt: 3 }}
              >
                <Typography variant="subtitle1">
                  Rendered field config
                </Typography>
                {createElement(rendedFieldSettings, {
                  config: newConfig,
                  onChange: handleChange,
                  onBlur: validateSettings,
                  errors,
                })}
              </Stack>
            )}
            {/* {
            <ConfigForm
              type={type}
              
              config={newConfig}
            />
          } */}
          </>
        </Suspense>
      }
      actions={{
        primary: {
          onClick: async () => {
            const errors = validateSettings();
            if (Object.keys(errors).length > 0) {
              confirm({
                title: "Invalid settings",
                body: (
                  <>
                    <Typography>Please fix the following settings:</Typography>
                    <ul style={{ paddingLeft: "1.5em" }}>
                      {Object.entries(errors).map(([key, message]) => (
                        <li key={key}>
                          <>
                            <code>{key}</code>: {message}
                          </>
                        </li>
                      ))}
                    </ul>
                  </>
                ),
                confirm: "Fix",
                hideCancel: true,
                handleConfirm: () => {},
              });
              return;
            }

            const savingSnack = enqueueSnackbar("Saving changes…");

            await updateColumn({
              key: column.key,
              config: { config: newConfig },
            });

            if (showRebuildPrompt) {
              confirm({
                title: "Deploy changes?",
                body: "You need to re-deploy this table’s cloud function to apply the changes you made. You can also re-deploy later.",
                confirm: "Deploy",
                cancel: "Later",
                handleConfirm: async () => {
                  if (!rowyRun) return;
                  snackLogContext.requestSnackLog();
                  rowyRun({
                    route: runRoutes.buildFunction,
                    body: {
                      tablePath: tableSettings.collection,
                      // pathname must match old URL format
                      pathname: getTableBuildFunctionPathname(
                        tableSettings.id,
                        tableSettings.tableType
                      ),
                      tableConfigPath: getTableSchemaPath(tableSettings),
                    },
                  });
                },
              });
            }

            closeSnackbar(savingSnack);
            enqueueSnackbar("Changes saved");

            onClose();
            setShowRebuildPrompt(false);
          },
          children: "Update",
        },
        secondary: {
          onClick: onClose,
          children: "Cancel",
        },
      }}
    />
  );
}
