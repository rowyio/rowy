import { useState } from "react";
import _isEqual from "lodash/isEqual";
import _upperFirst from "lodash/upperFirst";
import useStateRef from "react-usestateref";

import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepButton,
  StepContent,
  Typography,
  Link,
} from "@mui/material";
import ExpandIcon from "@mui/icons-material/KeyboardArrowDown";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";

import Modal, { IModalProps } from "components/Modal";
import Step1Triggers from "./Step1Triggers";
import Step2RequiredFields from "./Step2RequiredFields";
import Step3Conditions from "./Step3Conditions";
import Step4Body from "./Step4Body";

import { useConfirmation } from "components/ConfirmationDialog";

import { extensionNames, IExtension } from "./utils";
import { WIKI_LINKS } from "constants/externalLinks";

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
  const { requestConfirmation } = useConfirmation();

  const [extensionObject, setExtensionObject] =
    useState<IExtension>(initialObject);

  const [activeStep, setActiveStep] = useState(0);

  const [validation, setValidation, validationRef] =
    useStateRef<StepValidation>({ condition: true, extensionBody: true });

  const edited = !_isEqual(initialObject, extensionObject);

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

          <Stepper
            nonLinear
            activeStep={activeStep}
            orientation="vertical"
            sx={{
              mt: 0,

              "& .MuiStepLabel-root": { width: "100%" },
              "& .MuiStepLabel-label": {
                display: "flex",
                width: "100%",
                typography: "subtitle2",
                "&.Mui-active": { typography: "subtitle2" },
              },
              "& .MuiStepLabel-label svg": {
                display: "block",
                marginLeft: "auto",
                my: ((24 - 18) / 2 / 8) * -1,
                transition: (theme) => theme.transitions.create("transform"),
              },
              "& .Mui-active svg": {
                transform: "rotate(180deg)",
              },
            }}
          >
            <Step>
              <StepButton onClick={() => setActiveStep(0)}>
                Trigger events
                <ExpandIcon />
              </StepButton>
              <StepContent>
                <Typography gutterBottom>
                  Select which events trigger this extension
                </Typography>
                <Step1Triggers {...stepProps} />
              </StepContent>
            </Step>

            <Step>
              <StepButton onClick={() => setActiveStep(1)}>
                Required fields (optional)
                <ExpandIcon />
              </StepButton>
              <StepContent>
                <Typography gutterBottom>
                  Optionally, select fields that must have a value set for the
                  extension to be triggered for that row
                </Typography>
                <Step2RequiredFields {...stepProps} />
              </StepContent>
            </Step>

            <Step>
              <StepButton onClick={() => setActiveStep(2)}>
                Trigger conditions (optional)
                <ExpandIcon />
              </StepButton>
              <StepContent>
                <Typography gutterBottom>
                  Optionally, write a function that determines if the extension
                  should be triggered for a given row. Leave the function to
                  always return <code>true</code> if you do not want to write
                  additional logic.
                </Typography>
                <Step3Conditions {...stepProps} />
              </StepContent>
            </Step>

            <Step>
              <StepButton onClick={() => setActiveStep(3)}>
                Extension body
                <ExpandIcon />
              </StepButton>
              <StepContent>
                <Typography gutterBottom>
                  Write the extension body function. Make sure you have set all
                  the required parameters.{" "}
                  <Link
                    href={
                      WIKI_LINKS[
                        `extensions${_upperFirst(extensionObject.type)}`
                      ] || WIKI_LINKS.extensions
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Docs
                    <InlineOpenInNewIcon />
                  </Link>
                </Typography>
                <Step4Body {...stepProps} />
              </StepContent>
            </Step>
          </Stepper>
        </>
      }
      actions={{
        primary: {
          children: mode === "add" ? "Add" : "Update",
          disabled: !edited || !extensionObject.name.length,
          onClick: () => {
            let warningMessage;
            if (!validation.condition && !validation.extensionBody) {
              warningMessage = "Condition and extension body are not valid";
            } else if (!validation.condition) {
              warningMessage = "Condition is not valid";
            } else if (!validation.extensionBody) {
              warningMessage = "Extension body is not valid";
            }

            if (warningMessage) {
              requestConfirmation({
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
