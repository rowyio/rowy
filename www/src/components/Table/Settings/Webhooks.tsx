import React, { useState, useEffect } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import CodeEditor from "../editors/CodeEditor";
import { useFiretableContext } from "contexts/FiretableContext";
import { WEBHOOK_URL } from "../../../firebase";
import { makeId } from "../../../utils/fns";
import { DocActions } from "hooks/useDoc";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      width: "fit-content",
    },
    formControl: {
      marginTop: theme.spacing(2),
      minWidth: 120,
    },
    formControlLabel: {
      marginTop: theme.spacing(1),
    },
  })
);

enum WebhookTypes {
  custom = "CUSTOM",
  typeForm = "TYPE_FORM",
}
const EmptyState = {
  enabled: false,
  type: WebhookTypes.custom,
  secret: "",
  customParser: "",
};
export default function WebhooksDialog({ open, handleClose }) {
  const classes = useStyles();

  const { tableState, tableActions } = useFiretableContext();

  const [state, setState] = useState<{
    enabled: boolean;
    type: WebhookTypes;
    secret: string;
    customParser: string;
  }>(EmptyState);
  const tableFields = Object.keys(tableState?.columns as any);
  const fullWidth = true;
  const maxWidth: DialogProps["maxWidth"] = "xl";
  const handleChange = (key: string) => (value: any) => {
    setState((s) => ({ ...s, [key]: value }));
  };
  const initializeWebhooksConfig = () => {
    const secret = makeId(32);
    handleChange("secret")(secret);
    setState({ ...EmptyState, secret });
    tableActions?.table.updateConfig("webhooks", {
      enabled: false,
      type: WebhookTypes.custom,
      secret,
      customParser: "", // TODO: add a boilerplate/example
    });
  };
  useEffect(() => {
    if (
      tableState &&
      !tableState.config.tableConfig.loading &&
      !tableState?.config.webhooks &&
      !state.secret
    ) {
      initializeWebhooksConfig();
    } else if (tableState?.config.webhooks) {
      setState({ ...tableState?.config.webhooks });
    }
  }, [tableState?.config]);

  const handleWebhookTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    handleChange("type")(event.target.value as WebhookTypes);
  };

  const handleSave = async () => {
    handleClose();
    await tableActions?.table.updateConfig("webhooks", {
      ...state,
    });
  };
  const handleCancel = () => {
    handleClose();
    setState({ ...tableState?.config.webhooks });
  };
  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Webhooks</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={<Switch />}
              label={"Enable webhooks for this table"}
              labelPlacement="end"
              checked={state.enabled}
              onChange={
                (e) => {
                  handleChange("enabled")(!state.enabled);
                }
                //  handleChange("isCollectionGroup", !formState.isCollectionGroup)
              }
              // classes={{ root: classes.formControlLabel, label: classes.label }}
            />
            <InputLabel htmlFor="webhook-type">Webhook Type</InputLabel>
            <Select
              autoFocus
              value={state.type}
              onChange={handleWebhookTypeChange}
              inputProps={{
                name: "webhook-type",
                id: "webhook-type",
              }}
            >
              <MenuItem value={WebhookTypes.typeForm}>Typeform</MenuItem>
              <MenuItem value={WebhookTypes.custom}>Custom</MenuItem>
            </Select>
          </FormControl>
          {state.type === WebhookTypes.custom && (
            <CodeEditor
              script={state.customParser}
              handleChange={handleChange("customParser")}
            />
          )}
          <br />
          {state.type === WebhookTypes.typeForm && (
            <>
              <Typography variant="overline">Web hook url:</Typography>
              <Typography variant="body1">
                {WEBHOOK_URL}?tablePath={tableState?.tablePath}
                &type=TYPE_FORM&secret={state.secret}
              </Typography>
              <Typography variant="overline">instructions:</Typography>
              <Typography variant="body1">
                please set the question reference in typeform to the following
                field keys :{" "}
                {tableFields.map((key) => (
                  <>
                    {" "}
                    <b key={key}>{key}</b>,
                  </>
                ))}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
