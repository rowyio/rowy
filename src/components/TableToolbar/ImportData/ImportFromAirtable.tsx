import { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";

import { Button, Typography, TextField } from "@mui/material";

import {
  tableModalAtom,
  importAirtableAtom,
  tableScope,
} from "@src/atoms/tableScope";
import { analytics, logEvent } from "@src/analytics";
import { find } from "lodash-es";

export default function ImportFromAirtable() {
  const [{ baseId, tableId, apiKey }, setImportAirtable] = useAtom(
    importAirtableAtom,
    tableScope
  );
  const openTableModal = useSetAtom(tableModalAtom, tableScope);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>({});
  const [tableUrl, setTableUrl] = useState("");

  useEffect(() => {
    return () => {
      setImportAirtable({
        airtableData: null,
        apiKey: "",
        baseId: "",
        tableId: "",
      });
      setError(null);
      setLoading(false);
    };
  }, [setImportAirtable]);

  useEffect(() => {
    try {
      const url = new URL(tableUrl);
      const pathNames = url.pathname.split("/");
      const baseId = find(pathNames, (path) => /^app[\w]+$/.test(path)) ?? "";
      const tableId = find(pathNames, (path) => /^tbl[\w]+$/.test(path)) ?? "";
      setImportAirtable((prev) => ({ ...prev, baseId, tableId }));
    } catch (error) {}
  }, [tableUrl, setImportAirtable]);

  const handleAirtableConnection = () => {
    const errors = [];
    if (!apiKey) {
      errors.push({ apiKey: { message: "API Key is missing!" } });
    }
    if (!baseId) {
      errors.push({ baseId: { message: "Base ID is missing!" } });
    }
    if (!tableId) {
      errors.push({ tableId: { message: "Table ID is missing!" } });
    }
    if (errors.length > 0) {
      setError(
        errors.reduce((obj, error) => ({ ...obj, ...error }), {} as any)
      );
      return;
    }
    setLoading(true);
    fetch(`https://api.airtable.com/v0/${baseId}/${tableId}?maxRecords=20`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((response) => response.json())
      .then((body) => {
        const { error } = body;
        if (error) {
          if (error.type === "AUTHENTICATION_REQUIRED") {
            setError({ apiKey: { message: "Invalid API Key!" } });
          }
          if (error === "NOT_FOUND") {
            setError({ baseId: { message: "Could not find base!" } });
          }
          if (
            error.type === "TABLE_NOT_FOUND" ||
            error.type === "MODEL_ID_NOT_FOUND"
          ) {
            setError({ tableId: { message: "Could not find table!" } });
          }
          throw new Error(error);
        }

        setImportAirtable((prev) => ({ ...prev, airtableData: body }));
        openTableModal("importAirtable");
      })
      .then(() => {
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <>
      <Typography variant="caption" color="gray">
        Forget the storage limitations of Airtable. Migrate your app data from
        Airtable to a more scalable Firestore database that you can easily
        manage with Rowy.
      </Typography>
      <TextField
        variant="filled"
        autoFocus
        fullWidth
        label="Airtable API Key"
        placeholder="Insert your API key here"
        value={apiKey}
        onChange={(e) =>
          setImportAirtable((prev) => ({
            ...prev,
            apiKey: e.currentTarget.value,
          }))
        }
        helperText={error?.apiKey?.message}
        error={!!error?.apiKey?.message}
      />
      <TextField
        variant="filled"
        autoFocus
        fullWidth
        label="Airtable Table URL"
        placeholder="Insert your Table URL here"
        value={tableUrl}
        onChange={(e) => {
          setTableUrl(e.currentTarget.value);
        }}
        helperText={error?.baseId?.message || error?.tableId?.message}
        error={!!error?.baseId?.message || error?.tableId?.message}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{
          my: 2,
          mx: "auto",
          display: "flex",
          minWidth: 100,
        }}
        onClick={() => {
          handleAirtableConnection();
          logEvent(analytics, `import_airtable`);
        }}
      >
        Continue
      </Button>
    </>
  );
}
