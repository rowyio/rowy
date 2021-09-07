import { useState, Suspense, useMemo, createElement } from "react";
import { useSnackbar } from "notistack";

import _set from "lodash/set";
import { IMenuModalProps } from "..";

import Modal from "components/Modal";
import { getFieldProp } from "components/fields";
import DefaultValueInput from "./DefaultValueInput";
import ErrorBoundary from "components/ErrorBoundary";
import Loading from "components/Loading";

import { useProjectContext } from "contexts/ProjectContext";
import { useSnackLogContext } from "contexts/SnackLogContext";
import { db } from "../../../../firebase";
import { useAppContext } from "contexts/AppContext";
import { useConfirmation } from "components/ConfirmationDialog";
import { FieldType } from "constants/fields";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import routes from "constants/routes";
import { SETTINGS } from "config/dbPaths";
import { name as appName } from "@root/package.json";

export default function FieldSettings(props: IMenuModalProps) {
  const { name, fieldName, type, open, config, handleClose, handleSave } =
    props;

  const [showRebuildPrompt, setShowRebuildPrompt] = useState(false);
  const [newConfig, setNewConfig] = useState(config ?? {});
  const customFieldSettings = getFieldProp("settings", type);
  const initializable = getFieldProp("initializable", type);

  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();
  const { tableState } = useProjectContext();
  const snackLog = useSnackLogContext();
  const appContext = useAppContext();

  const handleChange = (key: string) => (update: any) => {
    if (
      showRebuildPrompt === false &&
      (key.includes("defaultValue") || type === FieldType.derivative) &&
      config[key] !== update
    ) {
      setShowRebuildPrompt(true);
    }
    console.log(key, update);
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
  console.log(newConfig);
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

            <section>
              {customFieldSettings &&
                createElement(customFieldSettings, {
                  config: newConfig,
                  handleChange,
                })}
            </section>
            {rendedFieldSettings && (
              <section>
                <Divider />
                <Typography variant="overline">
                  Rendered field config
                </Typography>
                {createElement(rendedFieldSettings, {
                  config: newConfig,
                  handleChange,
                })}
              </section>
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
                title: "Deploy Changes",
                body: "You have made changes that affect the behavior of the cloud function of this table, Would you like to redeploy it now?",
                confirm: "Deploy",
                cancel: "Later",
                handleConfirm: async () => {
                  const settingsDoc = await db.doc(SETTINGS).get();
                  const buildUrl = settingsDoc.get("buildUrl");
                  if (!buildUrl) {
                    enqueueSnackbar(`${appName} Run is not set up`, {
                      variant: "error",
                      action: (
                        <Button
                          variant="contained"
                          color="secondary"
                          component={"a"}
                          target="_blank"
                          href={routes.projectSettings}
                          rel="noopener noreferrer"
                        >
                          Go to Settings
                        </Button>
                      ),
                    });
                  }
                  const userTokenInfo =
                    await appContext?.currentUser?.getIdTokenResult();
                  const userToken = userTokenInfo?.token;
                  try {
                    snackLog.requestSnackLog();
                    const response = await fetch(buildUrl, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        configPath: tableState?.config.tableConfig.path,
                        token: userToken,
                      }),
                    });
                    const data = await response.json();
                  } catch (e) {
                    console.error(e);
                  }
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
