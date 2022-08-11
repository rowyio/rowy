import { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";

import { Button, Typography, TextField } from "@mui/material";

import {
  tableModalAtom,
  importAirtableAtom,
  tableScope,
} from "@src/atoms/tableScope";
import { analytics, logEvent } from "@src/analytics";

export default function ImportFromAirtable() {
  const [{ baseId, tableId, apiKey }, setImportAirtable] = useAtom(
    importAirtableAtom,
    tableScope
  );
  const openTableModal = useSetAtom(tableModalAtom, tableScope);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>({});

  useEffect(() => {
    return () => {
      setImportAirtable({
        airtableData: null,
        apiKey: "",
        baseId: "",
        tableId: "",
      });
    };
  }, [setImportAirtable]);

  const handleAirtableConnection = () => {
    if (!apiKey) {
      setError({ apiKey: { message: "API Key is missing!" } });
      return;
    }
    if (!baseId) {
      setError({ baseId: { message: "Base ID is missing!" } });
      return;
    }
    if (!tableId) {
      setError({ tableId: { message: "Table ID is missing!" } });
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
        label="Airtable Base ID"
        placeholder="Insert your Base ID here"
        value={baseId}
        onChange={(e) => {
          setImportAirtable((prev) => ({
            ...prev,
            baseId: e.currentTarget.value,
          }));
        }}
        helperText={error?.baseId?.message}
        error={!!error?.baseId?.message}
      />
      <TextField
        variant="filled"
        autoFocus
        fullWidth
        label="Airtable Table Name or ID"
        placeholder="Insert your Table Name or ID here"
        value={tableId}
        onChange={(e) => {
          setImportAirtable((prev) => ({
            ...prev,
            tableId: e.currentTarget.value,
          }));
        }}
        helperText={error?.tableId?.message}
        error={!!error?.tableId?.message}
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
