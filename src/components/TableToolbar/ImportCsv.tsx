import { useState, useCallback, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { parse } from "csv-parse/browser/esm";
import { useDropzone } from "react-dropzone";
import { useDebouncedCallback } from "use-debounce";
import { useSnackbar } from "notistack";

import {
  Button,
  Popover,
  PopoverProps as MuiPopoverProps,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  Divider,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import TableToolbarButton from "./TableToolbarButton";
import { Import as ImportIcon } from "@src/assets/icons";
import { Upload as FileUploadIcon } from "@src/assets/icons";
import CheckIcon from "@mui/icons-material/CheckCircle";

import { globalScope, userRolesAtom } from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  tableModalAtom,
  importCsvAtom,
} from "@src/atoms/tableScope";
import { analytics, logEvent } from "@src/analytics";

export enum ImportMethod {
  paste = "paste",
  upload = "upload",
  url = "url",
  airtable = "airtable",
}

export interface IImportCsvProps {
  render?: (
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  ) => React.ReactNode;
  PopoverProps?: Partial<MuiPopoverProps>;
}

export default function ImportCsv({ render, PopoverProps }: IImportCsvProps) {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [{ importType, csvData }, setImportCsv] = useAtom(
    importCsvAtom,
    tableScope
  );
  const openTableModal = useSetAtom(tableModalAtom, tableScope);
  const { enqueueSnackbar } = useSnackbar();

  const importTypeRef = useRef(importType);
  const importMethodRef = useRef(ImportMethod.upload);
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [tab, setTab] = useState("upload");

  const [error, setError] = useState<string | any>("");
  const validCsv =
    csvData !== null && csvData?.columns.length > 0 && csvData?.rows.length > 0;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setOpen(event.currentTarget);
  const handleClose = () => {
    setOpen(null);
    setImportCsv({ importType: "csv", csvData: null });
    setTab("upload");
    setError("");
  };
  const popoverId = open ? "csv-popover" : undefined;

  const parseCsv = useCallback(
    (csvString: string) =>
      parse(csvString, { delimiter: [",", "\t"] }, (err, rows) => {
        if (err) {
          setError(err.message);
        } else {
          const columns = rows.shift() ?? [];
          if (columns.length === 0) {
            setError("No columns detected");
          } else {
            const mappedRows = rows.map((row: any) =>
              row.reduce(
                (a: any, c: any, i: number) => ({ ...a, [columns[i]]: c }),
                {}
              )
            );
            setImportCsv({
              importType: importTypeRef.current,
              csvData: { columns, rows: mappedRows },
            });
            setError("");
          }
        }
      }),
    [setImportCsv]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (event: any) => parseCsv(event.target.result);
        reader.readAsText(file);
        importTypeRef.current =
          file.type === "text/tab-separated-values" ? "tsv" : "csv";
      } catch (error) {
        enqueueSnackbar(`Please import a .tsv or .csv file`, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      }
    },
    [enqueueSnackbar, parseCsv]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ["text/csv", "text/tab-separated-values"],
  });

  function setDataTypeRef(data: string) {
    const getFirstLine = data?.match(/^(.*)/)?.[0];
    /*
     *  Catching edge case with regex
     *  EG: "hello\tworld"\tFirst
     *  - find \t between quotes, and replace with '\s'
     *  - w/ the \t pattern test it against the formatted string
     */
    const strInQuotes = /"(.*?)"/;
    const tabsWithSpace = (str: string) => str.replace("\t", "s");
    const formatString =
      getFirstLine?.replace(strInQuotes, tabsWithSpace) ?? "";
    const tabPattern = /\t/;
    return tabPattern.test(formatString)
      ? (importTypeRef.current = "tsv")
      : (importTypeRef.current = "csv");
  }
  const handlePaste = useDebouncedCallback((value: string) => {
    parseCsv(value);
    setDataTypeRef(value);
  }, 1000);

  const [loading, setLoading] = useState(false);
  const handleUrl = useDebouncedCallback((value: string) => {
    setLoading(true);
    setError("");
    fetch(value, { mode: "no-cors" })
      .then((res) => res.text())
      .then((data) => {
        parseCsv(data);
        setDataTypeRef(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, 1000);

  const [airtable, setAirtable] = useState<any>({
    apiKey: "",
    baseID: "",
    tableID: "",
  });
  const [data, setData] = useState<any>(null);
  const [validConnection, setValidConnection] = useState(false);
  const handleAirtableConnection = () => {
    if (!airtable.apiKey) {
      setError({ apiKey: { message: "API Key is missing!" } });
      return;
    }
    if (!airtable.baseID) {
      setError({ baseID: { message: "Base ID is missing!" } });
      return;
    }
    if (!airtable.tableID) {
      setError({ tableID: { message: "Table ID is missing!" } });
      return;
    }
    setLoading(true);
    fetch(
      `https://api.airtable.com/v0/${airtable.baseID}/${airtable.tableID}?maxRecords=1`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${airtable.apiKey}`,
        },
      }
    )
      .then((response) => response.json())
      .then((body) => setData(body.records))
      .then(() => {
        setValidConnection(true);
        setLoading(false);
        setError("");
      });
  };

  if (tableSettings.readOnly && !userRoles.includes("ADMIN")) return null;

  return (
    <>
      {render ? (
        render(handleOpen)
      ) : (
        <TableToolbarButton
          title="Import CSV or TSV"
          onClick={handleOpen}
          icon={<ImportIcon />}
        />
      )}

      <Popover
        id={popoverId}
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        {...PopoverProps}
        sx={{
          "& .MuiTabPanel-root": { py: 2, px: 3, width: 400, height: 200 },
        }}
      >
        <TabContext value={tab}>
          <TabList
            onChange={(_, v) => {
              setTab(v);
              setImportCsv({
                importType: importTypeRef.current,
                csvData: null,
              });
              setError("");
            }}
            aria-label="Import CSV method tabs"
            action={(actions) =>
              setTimeout(() => actions?.updateIndicator(), 200)
            }
            variant="fullWidth"
          >
            <Tab
              label="Upload"
              value="upload"
              onClick={() => (importMethodRef.current = ImportMethod.upload)}
            />
            <Tab
              label="Paste"
              value="paste"
              onClick={() => (importMethodRef.current = ImportMethod.paste)}
            />
            <Tab
              label="URL"
              value="url"
              onClick={() => (importMethodRef.current = ImportMethod.url)}
            />
            <Tab
              label="Airtable"
              value="airtable"
              onClick={() => (importMethodRef.current = ImportMethod.airtable)}
            />
          </TabList>
          <Divider style={{ marginTop: -1 }} />

          <TabPanel value="upload">
            <Grid
              container
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              direction="column"
              {...getRootProps()}
              sx={[
                {
                  height: 137,
                  borderRadius: 1,
                  border: `dashed 2px currentColor`,
                  borderColor: "divider",
                  backgroundColor: "action.input",
                  cursor: "pointer",

                  "& svg": {
                    opacity: (theme) => theme.palette.action.activeOpacity,
                  },

                  "&:focus": {
                    borderColor: "primary.main",
                    color: "primary.main",
                    outline: "none",
                  },
                },
                error ? { borderColor: "error.main", color: "error.main" } : {},
              ]}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography variant="button" color="primary">
                  Drop CSV or TSV file here…
                </Typography>
              ) : (
                <>
                  <Grid item>
                    {validCsv ? <CheckIcon /> : <FileUploadIcon />}
                  </Grid>
                  <Grid item>
                    <Typography variant="button" color="inherit">
                      {validCsv
                        ? "Valid CSV or TSV"
                        : "Click to upload or drop CSV or TSV file here"}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>

            {error && (
              <FormHelperText error sx={{ my: 0.5, mx: 1.5 }}>
                {error}
              </FormHelperText>
            )}
          </TabPanel>

          <TabPanel value="paste">
            <TextField
              variant="filled"
              multiline
              inputProps={{ minRows: 3 }}
              autoFocus
              fullWidth
              label="Paste CSV or TSV text"
              placeholder="column, column, …"
              onChange={(e) => {
                if (csvData !== null)
                  setImportCsv({
                    importType: importTypeRef.current,
                    csvData: null,
                  });
                handlePaste(e.target.value);
              }}
              sx={{
                typography: "body2",
                fontFamily: "fontFamilyMono",

                "& .MuiInputBase-input": {
                  whiteSpace: "nowrap",
                  overflow: "auto",
                  fontFamily: "mono",
                },
              }}
              helperText={error}
              error={!!error}
            />
          </TabPanel>

          <TabPanel value="url">
            <TextField
              variant="filled"
              autoFocus
              fullWidth
              label="Paste URL to CSV or TSV file"
              placeholder="https://"
              onChange={(e) => {
                if (csvData !== null)
                  setImportCsv({
                    importType: importTypeRef.current,
                    csvData: null,
                  });
                handleUrl(e.target.value);
              }}
              helperText={loading ? "Fetching…" : error}
              error={!!error}
            />
          </TabPanel>

          <TabPanel value="airtable">
            <Typography variant="caption" color="gray">
              Forget the storage limitations of Airtable.
            </Typography>
            <TextField
              variant="filled"
              autoFocus
              fullWidth
              label="Airtable API Key"
              placeholder="Insert your API key here"
              value={airtable.apiKey}
              onChange={(e) => {
                setAirtable((airtable: any) => ({
                  ...airtable,
                  apiKey: e.currentTarget.value,
                }));
              }}
              helperText={error?.apiKey?.message}
              error={!!error?.apiKey?.message}
            />
            <TextField
              variant="filled"
              autoFocus
              fullWidth
              label="Airtable Base ID"
              placeholder="Insert your Base ID here"
              value={airtable.baseID}
              onChange={(e) => {
                setAirtable((airtable: any) => ({
                  ...airtable,
                  baseID: e.currentTarget.value,
                }));
              }}
              helperText={error?.baseID?.message}
              error={!!error?.baseID?.message}
            />
            <TextField
              variant="filled"
              autoFocus
              fullWidth
              label="Airtable Table Name or ID"
              placeholder="Insert your Table Name or ID here"
              value={airtable.tableID}
              onChange={(e) => {
                setAirtable((prev: any) => ({
                  ...airtable,
                  tableID: e.currentTarget.value,
                }));
              }}
              helperText={error?.tableID?.message}
              error={!!error?.tableID?.message}
            />
            {data &&
              data.map((record: any) => (
                <div>Airtable record: {record.id}</div>
              ))}
          </TabPanel>
        </TabContext>

        <Button
          variant="contained"
          color="primary"
          disabled={
            importMethodRef.current === "airtable"
              ? loading && validConnection
              : !validCsv
          }
          sx={{
            mt: -4,
            mx: "auto",
            mb: 2,
            display: "flex",
            minWidth: 100,
          }}
          onClick={() => {
            if (importMethodRef.current === "airtable") {
              if (!data) {
                handleAirtableConnection();
              } else {
                console.log("hello");
                openTableModal("importCsv");
              }
            } else {
              openTableModal("importCsv");
              logEvent(analytics, `import_${importMethodRef.current}`, {
                type: importTypeRef.current,
              });
            }
          }}
        >
          {importMethodRef.current === "airtable"
            ? data
              ? "Continue"
              : "Test Connection"
            : "Continue"}
        </Button>
      </Popover>
    </>
  );
}
