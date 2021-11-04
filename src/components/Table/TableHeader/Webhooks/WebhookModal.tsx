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
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import Modal, { IModalProps } from "@src/components/Modal";
import Step1Secret from "./Step1Secret";
import Step2Conditions from "./Step2Conditions";
import Step3Body from "./Step3Parser";

import { useConfirmation } from "@src/components/ConfirmationDialog";

import { webhookNames, IWebhook } from "./utils";
import { WIKI_LINKS } from "@src/constants/externalLinks";

type StepValidation = Record<"condition" | "parser", boolean>;
export interface IWebhookModalStepProps {
  webhookObject: IWebhook;
  setWebhookObject: React.Dispatch<React.SetStateAction<IWebhook>>;
  validation: StepValidation;
  setValidation: React.Dispatch<React.SetStateAction<StepValidation>>;
  validationRef: React.RefObject<StepValidation>;
}

export interface IWebhookModalProps {
  handleClose: IModalProps["onClose"];
  handleAdd: (webhookObject: IWebhook) => void;
  handleUpdate: (webhookObject: IWebhook) => void;
  mode: "add" | "update";
  webhookObject: IWebhook;
}

export default function WebhookModal({
  handleClose,
  handleAdd,
  handleUpdate,
  mode,
  webhookObject: initialObject,
}: IWebhookModalProps) {
  const { requestConfirmation } = useConfirmation();

  const [webhookObject, setWebhookObject] = useState<IWebhook>(initialObject);

  const [activeStep, setActiveStep] = useState(0);

  const [validation, setValidation, validationRef] =
    useStateRef<StepValidation>({ condition: true, parser: true });

  const edited = !_isEqual(initialObject, webhookObject);

  const handleAddOrUpdate = () => {
    if (mode === "add") handleAdd(webhookObject);
    if (mode === "update") handleUpdate(webhookObject);
  };

  const stepProps = {
    webhookObject,
    setWebhookObject,
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
      title={`${mode === "add" ? "Add" : "Update"} webhook: ${
        webhookNames[webhookObject.type]
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
                label="Webhook name"
                variant="filled"
                fullWidth
                autoFocus
                value={webhookObject.name}
                error={edited && !webhookObject.name.length}
                helperText={
                  edited && !webhookObject.name.length ? "Required" : " "
                }
                onChange={(event) => {
                  setWebhookObject({
                    ...webhookObject,
                    name: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={webhookObject.active}
                    onChange={(e) =>
                      setWebhookObject((webhookObject) => ({
                        ...webhookObject,
                        active: e.target.checked,
                      }))
                    }
                    size="medium"
                  />
                }
                label={`Webhook endpoint is ${
                  !webhookObject.active ? "de" : ""
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
                Verification
                <ExpandIcon />
              </StepButton>
              <StepContent>
                <Typography gutterBottom>
                  Set the verification secret for the webhook.
                </Typography>
                <Step1Secret {...stepProps} />
              </StepContent>
            </Step>

            <Step>
              <StepButton onClick={() => setActiveStep(1)}>
                Conditions (optional)
                <ExpandIcon />
              </StepButton>
              <StepContent>
                <Typography gutterBottom>
                  Optionally, write a function that determines if the webhook
                  call should be processed. Leave the function to always return{" "}
                  <code>true</code> if you do not want to write additional
                  logic.
                </Typography>
                <Step2Conditions {...stepProps} />
              </StepContent>
            </Step>

            <Step>
              <StepButton onClick={() => setActiveStep(2)}>
                Parser
                <ExpandIcon />
              </StepButton>
              <StepContent>
                <Typography gutterBottom>
                  Write the webhook parsed function. The returned object of the
                  parser will be added as new row{" "}
                  <Link
                    href={
                      WIKI_LINKS[
                        `webhooks${_upperFirst(webhookObject.type)}`
                      ] || WIKI_LINKS.webhooks
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Docs
                    <InlineOpenInNewIcon />
                  </Link>
                </Typography>
                <Step3Body {...stepProps} />
              </StepContent>
            </Step>
          </Stepper>
        </>
      }
      actions={{
        primary: {
          children: mode === "add" ? "Add" : "Update",
          disabled: !edited || !webhookObject.name.length,
          onClick: () => {
            let warningMessage;
            if (!validation.condition && !validation.parser) {
              warningMessage = "Condition and webhook body are not valid";
            } else if (!validation.condition) {
              warningMessage = "Condition is not valid";
            } else if (!validation.parser) {
              warningMessage = "Webhook body is not valid";
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
