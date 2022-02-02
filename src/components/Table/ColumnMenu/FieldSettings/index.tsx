import { useState, Suspense, useMemo, createElement } from "react";
import _set from "lodash/set";
import { IMenuModalProps } from "..";

import { Typography, Stack } from "@mui/material";

import Modal from "@src/components/Modal";
import { getFieldProp } from "@src/components/fields";
import DefaultValueInput from "./DefaultValueInput";
import ErrorBoundary from "@src/components/ErrorBoundary";
import Loading from "@src/components/Loading";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { useConfirmation } from "@src/components/ConfirmationDialog";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";
import { FieldType } from "@src/constants/fields";
import { runRoutes } from "@src/constants/runRoutes";
import { useSnackbar } from "notistack";

export default function FieldSettings(props: IMenuModalProps) {
  const { name, fieldName, type, open, config, handleClose, handleSave } =
    props;

  const [showRebuildPrompt, setShowRebuildPrompt] = useState(false);
  const [newConfig, setNewConfig] = useState(config ?? {});
  const customFieldSettings = getFieldProp("settings", type);
  const settingsValidator = getFieldProp("settingsValidator", type);
  const initializable = getFieldProp("initializable", type);

  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();
  const { tableState, rowyRun } = useProjectContext();
  const snackLogContext = useSnackLogContext();

  const rendedFieldSettings = useMemo(
    () =>
      [FieldType.derivative, FieldType.aggregate].includes(type) &&
      newConfig.renderFieldType
        ? getFieldProp("settings", newConfig.renderFieldType)
        : null,
    [newConfig.renderFieldType, type]
  );

  const [errors, setErrors] = useState({});

  if (!open) return null;

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
      (key.includes("defaultValue") || type === FieldType.derivative) &&
      config[key] !== update
    ) {
      setShowRebuildPrompt(true);
    }
    const updatedConfig = _set({ ...newConfig }, key, update);
    setNewConfig(updatedConfig);
    validateSettings();
  };

  return (
    <Modal
      maxWidth="md"
      onClose={handleClose}
      title={`${name}: Settings`}
      disableBackdropClick
      disableEscapeKeyDown
      children={
        <Suspense fallback={<Loading fullScreen={false} />}>
          <>
            {initializable && (
              <>
                <section style={{ marginTop: 1 }}>
                  {/* top margin fixes visual bug */}
                  <ErrorBoundary fullScreen={false}>
                    <DefaultValueInput
                      handleChange={handleChange}
                      {...props}
                      config={newConfig}
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
                  fieldName,
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
          onClick: () => {
            const errors = validateSettings();
            if (Object.keys(errors).length > 0) {
              requestConfirmation({
                title: "Invalid settings",
                customBody: (
                  <>
                    <Typography>Please fix the following settings:</Typography>
                    <ul style={{ paddingLeft: "1.5em" }}>
                      {Object.entries(errors).map(([key, message]) => (
                        <li key={key}>
                          <code>{key}</code>: {message}
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
            if (showRebuildPrompt) {
              enqueueSnackbar("Saving changes...", {
                autoHideDuration: 1500,
              });
              handleSave(fieldName, { config: newConfig }, () => {
                requestConfirmation({
                  title: "Deploy changes",
                  body: "You have made changes that affect the behavior of the cloud function of this table, Would you like to redeploy it now?",
                  confirm: "Deploy",
                  cancel: "Later",
                  handleConfirm: async () => {
                    if (!rowyRun) return;
                    snackLogContext.requestSnackLog();
                    rowyRun({
                      route: runRoutes.buildFunction,
                      body: {
                        tablePath: tableState?.tablePath,
                        pathname: window.location.pathname,
                        tableConfigPath: tableState?.config.tableConfig.path,
                      },
                    });
                  },
                });
              });
            } else {
              handleSave(fieldName, { config: newConfig });
            }

            handleClose();
            setShowRebuildPrompt(false);
          },
          children: "Update",
        },
        secondary: {
          onClick: handleClose,
          children: "Cancel",
        },
      }}
    />
  );
}
