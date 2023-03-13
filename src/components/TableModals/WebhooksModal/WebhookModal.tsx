import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { isEqual } from "lodash-es";
import useStateRef from "react-usestateref";

import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Copy as CopyIcon } from "@src/assets/icons";

import Modal, { IModalProps } from "@src/components/Modal";
import SteppedAccordion from "@src/components/SteppedAccordion";
import Step1Auth from "./Step1Auth";
import Step2Conditions from "./Step2Conditions";
import Step3Body from "./Step3Parser";

import {
  projectScope,
  projectSettingsAtom,
  confirmDialogAtom,
} from "@src/atoms/projectScope";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";
import { webhookNames, IWebhook } from "./utils";

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
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);

  const [webhookObject, setWebhookObject] = useState<IWebhook>(initialObject);

  const [validation, setValidation, validationRef] =
    useStateRef<StepValidation>({ condition: true, parser: true });

  const edited = !isEqual(initialObject, webhookObject);

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

  const baseUrl = `${projectSettings.services?.hooks}/wh/${tableSettings.collection}/`;

  return (
    <Modal
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      title={`${mode === "add" ? "Add" : "Update"} Webhook: ${
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

          <Stack direction="row" alignItems="center" style={{ marginTop: 0 }}>
            <Typography
              variant="inherit"
              style={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              Endpoint URL:
            </Typography>
            &nbsp;
            <Typography
              variant="caption"
              style={{ overflowX: "auto", whiteSpace: "nowrap", flexGrow: 1 }}
            >
              <code>
                {baseUrl}
                {webhookObject.endpoint}
              </code>
            </Typography>
            <Tooltip title="Copy endpoint URL">
              <IconButton
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${baseUrl}${webhookObject.endpoint}`
                  )
                }
                sx={{ flexShrink: 0, mr: -0.75 }}
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <SteppedAccordion
            steps={[
              {
                id: "verification",
                title: "Verification",
                optional: true,
                content: <Step1Auth {...stepProps} />,
              },
              {
                id: "conditions",
                title: "Conditions",
                optional: true,
                content: <Step2Conditions {...stepProps} />,
              },
              {
                id: "parser",
                title: "Parser",
                content: <Step3Body {...stepProps} />,
              },
            ]}
            style={{ marginTop: "var(--dialog-contents-spacing)" }}
          />
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
