import React, { useState, Suspense } from "react";
import _sortBy from "lodash/sortBy";
import _set from "lodash/set";
import { IMenuModalProps } from "..";

import Modal from "components/Modal";
import { getFieldProp } from "components/fields";
import DefaultValueInput from "./DefaultValueInput";
import ErrorBoundary from "components/ErrorBoundary";
import Loading from "components/Loading";

import { useFiretableContext } from "contexts/FiretableContext";
import { triggerCloudBuild } from "../../../../firebase/callables";
import { useConfirmation } from "components/ConfirmationDialog";
import { FieldType } from "constants/fields";

export default function FieldSettings(props: IMenuModalProps) {
  const {
    name,
    fieldName,
    type,
    open,
    config,
    handleClose,
    handleSave,
  } = props;

  const [newConfig, setNewConfig] = useState(config ?? {});
  const customFieldSettings = getFieldProp("settings", type);
  const initializable = getFieldProp("initializable", type);

  const { requestConfirmation } = useConfirmation();
  const { tableState } = useFiretableContext();

  const handleChange = (key: string) => (update: any) => {
    const updatedConfig = _set({ ...newConfig }, key, update);
    setNewConfig(updatedConfig);
  };

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
                {/* 
                //TODO
                <section>
                  <Subheading>Required?</Subheading>
                  <Typography color="textSecondary" paragraph>
                    The row will not be created or updated unless all required
                    values are set.
                  </Typography>

                  <FormControlLabel
                    value="required"
                    label="Make this column required"
                    labelPlacement="start"
                    control={
                      <Switch
                        checked={newConfig["required"]}
                        onChange={() =>
                          setNewConfig({
                            ...newConfig,
                            required: !Boolean(newConfig["required"]),
                          })
                        }
                        name="required"
                      />
                    }
                    style={{
                      marginLeft: 0,
                      justifyContent: "space-between",
                    }}
                  />
                </section> */}

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
                React.createElement(customFieldSettings, {
                  config: newConfig,
                  handleChange,
                })}
            </section>

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
            handleSave(fieldName, { config: newConfig });

            if (
              type === FieldType.derivative &&
              config.script !== newConfig.script
            ) {
              requestConfirmation({
                title: "Deploy Changes",
                body:
                  "Would you like to redeploy the Cloud Function for this table now?",
                confirm: "Deploy",
                cancel: "Later",
                handleConfirm: async () => {
                  const response = await triggerCloudBuild(
                    tableState?.config.tableConfig.path
                  );
                  console.log(response);
                },
              });
            }
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
