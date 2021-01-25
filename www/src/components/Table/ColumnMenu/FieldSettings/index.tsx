import React, { useState, Suspense } from "react";
import _sortBy from "lodash/sortBy";
import _set from "lodash/set";
import { IMenuModalProps } from "..";

import { Typography, FormControlLabel, Switch } from "@material-ui/core";

import StyledModal from "components/StyledModal";
import { getFieldProp } from "components/fields";
import Subheading from "../Subheading";
import DefaultValueInput from "./DefaultValueInput";
import ErrorBoundary from "components/ErrorBoundary";
import Loading from "components/Loading";

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

  const handleChange = (key: string) => (update: any) => {
    const updatedConfig = _set({ ...newConfig }, key, update);
    setNewConfig(updatedConfig);
  };

  return (
    <StyledModal
      maxWidth="md"
      open={open}
      onClose={handleClose}
      title={`${name}: Settings`}
      children={
        <Suspense fallback={<Loading fullScreen={false} />}>
          <>
            {initializable && (
              <>
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
                </section>

                <section>
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
          onClick: () => handleSave(fieldName, { config: newConfig }),
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
