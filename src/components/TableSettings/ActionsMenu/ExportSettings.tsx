import { useState } from "react";
import { Control, useWatch } from "react-hook-form";
import stringify from "json-stable-stringify-without-jsonify";
import _isEmpty from "lodash/isEmpty";
import { useSnackbar } from "notistack";

import { MenuItem, DialogContentText, LinearProgress } from "@mui/material";

import { analytics } from "@src/analytics";
import Modal from "@src/components/Modal";
import CodeEditor from "@src/components/CodeEditor";

import useTableConfig from "@src/hooks/useTable/useTableConfig";

export interface IExportSettingsProps {
  closeMenu: () => void;
  control: Control;
}

export default function ExportSettings({
  closeMenu,
  control,
}: IExportSettingsProps) {
  const [open, setOpen] = useState(false);

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

  const { enqueueSnackbar } = useSnackbar();
  const handleExport = () => {
    analytics.logEvent("export_tableSettings");
    navigator.clipboard.writeText(formattedJson);
    enqueueSnackbar("Copied to clipboard");
    handleClose();
  };

  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>Export table settings…</MenuItem>

      {open && (
        <Modal
          onClose={handleClose}
          title="Export table settings"
          header={
            <>
              {tableConfigState.loading && values.id && (
                <LinearProgress
                  style={{ position: "absolute", top: 0, left: 0, right: 0 }}
                />
              )}
              <DialogContentText style={{ margin: "0 var(--dialog-spacing)" }}>
                Export table settings and columns in JSON format
              </DialogContentText>
            </>
          }
          body={
            <div style={{ marginTop: "var(--dialog-contents-spacing)" }}>
              <CodeEditor
                disabled
                value={formattedJson}
                defaultLanguage="json"
                minHeight={300}
              />
            </div>
          }
          actions={{
            primary: {
              children: "Copy to clipboard",
              onClick: handleExport,
            },
            secondary: {
              children: "Cancel",
              onClick: handleClose,
            },
          }}
        />
      )}
    </>
  );
}
