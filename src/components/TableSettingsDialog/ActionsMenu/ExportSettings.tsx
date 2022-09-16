import { useState } from "react";
import { useAtom } from "jotai";
import { Control, useWatch } from "react-hook-form";
import stringify from "json-stable-stringify-without-jsonify";
import { merge } from "lodash-es";
import { useSnackbar } from "notistack";

import { MenuItem, DialogContentText } from "@mui/material";

import Modal from "@src/components/Modal";
import CodeEditor from "@src/components/CodeEditor";

import {
  projectScope,
  tableSettingsDialogSchemaAtom,
} from "@src/atoms/projectScope";
import { analytics, logEvent } from "@src/analytics";

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
  const [tableSchema] = useAtom(tableSettingsDialogSchemaAtom, projectScope);

  const formattedJson = stringify(
    { ...values, _schema: merge(tableSchema, values._schema) },
    {
      space: 2,
      cmp: (a: any, b: any) =>
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
    logEvent(analytics, "export_tableSettings");
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
            <DialogContentText style={{ margin: "0 var(--dialog-spacing)" }}>
              Export table settings and columns in JSON format
            </DialogContentText>
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
