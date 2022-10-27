import { useState } from "react";
import { useSetAtom } from "jotai";
import { isEqual } from "lodash-es";
import useStateRef from "react-usestateref";

import { Grid, TextField, FormControlLabel, Switch } from "@mui/material";

import Modal, { IModalProps } from "@src/components/Modal";
import SteppedAccordion from "@src/components/SteppedAccordion";
import Step1Triggers from "./Step1Triggers";
import Step2RequiredFields from "./Step2RequiredFields";
import Step3Conditions from "./Step3Conditions";
import Step4Body from "./Step4Body";

import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";
import { extensionNames, IExtension } from "./utils";

type StepValidation = Record<"condition" | "extensionBody", boolean>;
export interface IExtensionModalStepProps {
  extensionObject: IExtension;
  setExtensionObject: React.Dispatch<React.SetStateAction<IExtension>>;
  validation: StepValidation;
  setValidation: React.Dispatch<React.SetStateAction<StepValidation>>;
  validationRef: React.RefObject<StepValidation>;
}

export interface IExtensionModalProps {
  handleClose: IModalProps["onClose"];
  handleAdd: (extensionObject: IExtension) => void;
  handleUpdate: (extensionObject: IExtension) => void;
  mode: "add" | "update";
  extensionObject: IExtension;
}

export default function ExtensionModal({
  handleClose,
  handleAdd,
  handleUpdate,
  mode,
  extensionObject: initialObject,
}: IExtensionModalProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);

  const [extensionObject, setExtensionObject] =
    useState<IExtension>(initialObject);

  const [validation, setValidation, validationRef] =
    useStateRef<StepValidation>({ condition: true, extensionBody: true });

  const edited = !isEqual(initialObject, extensionObject);

  const handleAddOrUpdate = () => {
    if (mode === "add") handleAdd(extensionObject);
    if (mode === "update") handleUpdate(extensionObject);
  };

  const stepProps = {
    extensionObject,
    setExtensionObject,
    validation,
    setValidation,
    validationRef,
  };

  return (
    <Modal
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      title={`${mode === "add" ? "Add" : "Update"} Extension: ${
        extensionNames[extensionObject.type]
      }`}
      sx={{
        "& .MuiPaper-root": {
          maxWidth: 742 + 20,
          height: 980,
        },
      }}
      children={
        <>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={6}>
              <TextField
                size="small"
                required
                label="Extension name"
                variant="filled"
                fullWidth
                autoFocus
                value={extensionObject.name}
                error={edited && !extensionObject.name.length}
                helperText={
                  edited && !extensionObject.name.length ? "Required" : " "
                }
                onChange={(event) => {
                  setExtensionObject({
                    ...extensionObject,
                    name: event.target.value,
                  });
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={extensionObject.active}
                    onChange={(e) =>
                      setExtensionObject((extensionObject) => ({
                        ...extensionObject,
                        active: e.target.checked,
                      }))
                    }
                    size="medium"
                  />
                }
                label={`Extension is ${
                  !extensionObject.active ? "de" : ""
                }activated`}
              />
            </Grid>
          </Grid>

          <SteppedAccordion
            steps={[
              {
                id: "triggers",
                title: "Trigger events",
                content: <Step1Triggers {...stepProps} />,
              },
              {
                id: "requiredFields",
                title: "Required fields",
                optional: true,
                content: <Step2RequiredFields {...stepProps} />,
              },
              {
                id: "conditions",
                title: "Trigger conditions",
                optional: true,
                content: <Step3Conditions {...stepProps} />,
              },
              {
                id: "body",
                title: "Extension body",
                content: <Step4Body {...stepProps} />,
              },
            ]}
          />
        </>
      }
      actions={{
        primary: {
          children: mode === "add" ? "Add" : "Update",
          disabled: !edited || !extensionObject.name.length,
          onClick: () => {
            let warningMessage;
            if (!validation.condition && !validation.extensionBody) {
              warningMessage = "Condition and Extension body are not valid";
            } else if (!validation.condition) {
              warningMessage = "Condition is not valid";
            } else if (!validation.extensionBody) {
              warningMessage = "Extension body is not valid";
            }

            if (warningMessage) {
              confirm({
                title: "Validation failed",
                body: `${warningMessage}. Continue?`,
                confirm: "Yes, I know what I’m doing",
                cancel: "No, I’ll fix the errors",
                handleConfirm: handleAddOrUpdate,
              });
            } else {
              handleAddOrUpdate();
            }
          },
        },
      }}
    />
  );
}
