import { useState, Suspense, useMemo, createElement } from "react";
import _set from "lodash/set";
import { IMenuModalProps } from "..";

import { Typography, Divider, Stack } from "@mui/material";

import Modal from "components/Modal";
import { getFieldProp } from "components/fields";
import DefaultValueInput from "./DefaultValueInput";
import ErrorBoundary from "components/ErrorBoundary";
import Loading from "components/Loading";

import { useProjectContext } from "contexts/ProjectContext";
import { useConfirmation } from "components/ConfirmationDialog";
import { FieldType } from "constants/fields";
import { runRoutes } from "constants/runRoutes";

export default function FieldSettings(props: IMenuModalProps) {
  const { name, fieldName, type, open, config, handleClose, handleSave } =
    props;

  const [showRebuildPrompt, setShowRebuildPrompt] = useState(false);
  const [newConfig, setNewConfig] = useState(config ?? {});
  const customFieldSettings = getFieldProp("settings", type);
  const initializable = getFieldProp("initializable", type);

  const { requestConfirmation } = useConfirmation();
  const { tableState, rowyRun } = useProjectContext();

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
  };
  const rendedFieldSettings = useMemo(
    () =>
      [FieldType.derivative, FieldType.aggregate].includes(type) &&
      newConfig.renderFieldType
        ? getFieldProp("settings", newConfig.renderFieldType)
        : null,
    [newConfig.renderFieldType, type]
  );
  if (!open) return null;

  return (
    <Modal
      maxWidth="md"
      onClose={handleClose}
      title={`${name}: Settings`}
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
                  handleChange,
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
                  handleChange,
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
            if (showRebuildPrompt) {
              requestConfirmation({
                title: "Deploy changes",
                body: "You have made changes that affect the behavior of the cloud function of this table, Would you like to redeploy it now?",
                confirm: "Deploy",
                cancel: "Later",
                handleConfirm: async () => {
                  if (!rowyRun) return;
                  rowyRun({
                    route: runRoutes.buildFunction,
                    body: {
                      tablePath: tableState?.tablePath,
                      pathname: window.location.pathname,
                      tableConfigPath: tableState?.config.tableConfig.path,
                    },
                    params: [],
                  });
                },
              });
            }
            handleSave(fieldName, { config: newConfig });
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
