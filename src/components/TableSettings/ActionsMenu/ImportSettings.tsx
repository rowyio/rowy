import { useState } from "react";
import { Control, useWatch } from "react-hook-form";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import stringify from "json-stable-stringify-without-jsonify";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { useSnackbar } from "notistack";

import { MenuItem, DialogContentText, FormHelperText } from "@mui/material";

import { analytics } from "@src/analytics";
import Modal from "@src/components/Modal";
import DiffEditor from "@src/components/CodeEditor/DiffEditor";

import useTableConfig from "@src/hooks/useTable/useTableConfig";
import { useConfirmation } from "@src/components/ConfirmationDialog";

export interface IImportSettingsProps {
  closeMenu: () => void;
  control: Control;
  useFormMethods: UseFormReturn<FieldValues, object>;
}

export default function ImportSettings({
  closeMenu,
  control,
  useFormMethods,
}: IImportSettingsProps) {
  const [open, setOpen] = useState(false);

  const [newSettings, setNewSettings] = useState("");
  const [valid, setValid] = useState(true);

  const { _suggestedRules, ...values } = useWatch({ control });
  const [tableConfigState] = useTableConfig(values.id);
  const { id, ref, ..._schema } = tableConfigState.doc ?? {};

  const formattedJson = stringify(
    // Allow values._schema to take priority if user imported _schema before
    "_schema" in values || _isEmpty(_schema) ? values : { ...values, _schema },
    {
      space: 2,
      cmp: (a, b) =>
        // Sort _schema at the end
        a.key.startsWith("_")
          ? 1
          : // Otherwise, sort alphabetically
          a.key > b.key
          ? 1
          : -1,
    }
  );

  const handleClose = () => {
    setOpen(false);
    closeMenu();
  };

  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();
  const { setValue } = useFormMethods;
  const handleImport = () => {
    analytics.logEvent("import_tableSettings");
    const { id, collection, ...newValues } = JSON.parse(newSettings);
    for (const key in newValues) {
      setValue(key, newValues[key], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    enqueueSnackbar("Imported settings");
    handleClose();
  };

  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>Import table settings…</MenuItem>

      {open && (
        <Modal
          onClose={handleClose}
          title="Import table settings"
          header={
            <DialogContentText style={{ margin: "0 var(--dialog-spacing)" }}>
              Import table settings in JSON format. This will overwrite any
              existing settings, except for the table ID and collection.
            </DialogContentText>
          }
          body={
            <div style={{ marginTop: "var(--dialog-contents-spacing)" }}>
              <DiffEditor
                original={formattedJson}
                modified={newSettings}
                language="json"
                onChange={(v) => {
                  try {
                    if (v) {
                      JSON.parse(v);
                      setNewSettings(v);
                      setValid(true);
                    }
                  } catch (e) {
                    console.log(`Failed to parse JSON: ${e}`);
                    setValid(false);
                  }
                }}
                error={!valid}
                minHeight={300}
              />
            </div>
          }
          footer={
            !valid && (
              <FormHelperText
                error
                variant="filled"
                sx={{ mx: "auto", mt: 1, mb: -1 }}
              >
                Invalid JSON
              </FormHelperText>
            )
          }
          actions={{
            primary: {
              children: "Import",
              onClick: () => {
                const parsedJson = JSON.parse(newSettings);
                const hasExtensions = Boolean(
                  _get(parsedJson, "_schema.extensionObjects")
                );
                const hasWebhooks = Boolean(
                  _get(parsedJson, "_schema.webhooks")
                );

                requestConfirmation({
                  title: "Import settings?",
                  customBody: (
                    <>
                      <DialogContentText paragraph>
                        You will overwrite any existing settings for this table,{" "}
                        <b>except for the table ID and collection</b>.
                      </DialogContentText>

                      {(hasExtensions || hasWebhooks) && (
                        <DialogContentText paragraph>
                          You’re importing new{" "}
                          <b>
                            {[
                              hasExtensions && "extensions",
                              hasWebhooks && "webhooks",
                            ]
                              .filter(Boolean)
                              .join(" and ")}
                          </b>{" "}
                          for this table. You’ll be prompted to <b>deploy</b>{" "}
                          them when you save the table settings.
                        </DialogContentText>
                      )}
                    </>
                  ),
                  confirm: "Import",
                  handleConfirm: handleImport,
                });
              },
              disabled: !valid,
            },
            secondary: {
              children: "Cancel",
              onClick: handleClose,
            },
          }}
          maxWidth="lg"
        />
      )}
    </>
  );
}
