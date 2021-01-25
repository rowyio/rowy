import React, { useState } from "react";
import _sortBy from "lodash/sortBy";
import _set from "lodash/set";
import { IMenuModalProps } from "..";

import { Typography, FormControlLabel, Switch } from "@material-ui/core";

import StyledModal from "components/StyledModal";
import { getFieldProp } from "components/fields";
import Subheading from "../Subheading";
import DefaultValueInput from "./DefaultValueInput";

export default function FieldSettings({
  name,
  fieldName,
  type,
  open,
  config,
  handleClose,
  handleSave,
}: IMenuModalProps) {
  const [newConfig, setNewConfig] = useState(config ?? {});
  const customFieldSettings = getFieldProp("settings", type);
  const initializable = getFieldProp("initializable", type);

  const handleChange = (key: string) => (update: any) => {
    const updatedConfig = _set({ ...newConfig }, key, update);
    setNewConfig(updatedConfig);
  };

  return (
    <StyledModal
      maxWidth="xl"
      open={open}
      onClose={handleClose}
      title={`${name}: Settings`}
      children={
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
                <DefaultValueInput
                  fieldType={type}
                  config={newConfig}
                  handleChange={handleChange}
                />
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
